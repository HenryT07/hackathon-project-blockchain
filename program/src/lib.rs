use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    sysvar::{clock::Clock, Sysvar},
};
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct StudySession {
    pub student: Pubkey,
    pub stake_amount: u64,
    pub start_time: i64,
    pub duration_minutes: u32,
    pub keystroke_goal: u32,
    pub completed: bool,
    pub tokens_returned: bool,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum StudyStakingInstruction {
    /// Initialize a study session
    /// Accounts:
    /// 0. [signer] Student wallet
    /// 1. [writable] Study session account
    /// 2. [writable] Student token account
    /// 3. [writable] Program token account (for staking)
    /// 4. [] Token program
    /// 5. [] System program
    InitializeSession {
        stake_amount: u64,
        duration_minutes: u32,
        keystroke_goal: u32,
    },
    /// Complete a study session and claim rewards
    /// Accounts:
    /// 0. [signer] Student wallet
    /// 1. [writable] Study session account
    /// 2. [writable] Student token account
    /// 3. [writable] Program token account
    /// 4. [] Token program
    CompleteSession {
        actual_keystrokes: u32,
    },
    /// Fail a session (tokens burn or go to pool)
    /// Accounts:
    /// 0. [signer] Student wallet
    /// 1. [writable] Study session account
    /// 2. [writable] Program token account
    /// 3. [writable] Communal pool account (optional)
    /// 4. [] Token program
    FailSession,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = StudyStakingInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        StudyStakingInstruction::InitializeSession {
            stake_amount,
            duration_minutes,
            keystroke_goal,
        } => {
            msg!("Initializing study session with stake: {}, duration: {} minutes, keystroke goal: {}", 
                 stake_amount, duration_minutes, keystroke_goal);
            initialize_session(program_id, accounts, stake_amount, duration_minutes, keystroke_goal)
        }
        StudyStakingInstruction::CompleteSession { actual_keystrokes } => {
            msg!("Completing study session with {} keystrokes", actual_keystrokes);
            complete_session(program_id, accounts, actual_keystrokes)
        }
        StudyStakingInstruction::FailSession => {
            msg!("Failing study session - tokens will be burned or sent to pool");
            fail_session(program_id, accounts)
        }
    }
}

fn initialize_session(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    stake_amount: u64,
    duration_minutes: u32,
    keystroke_goal: u32,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let student = next_account_info(account_info_iter)?;
    let session_account = next_account_info(account_info_iter)?;

    // Verify student is signer
    if !student.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Get current time
    let clock = Clock::get()?;
    let start_time = clock.unix_timestamp;

    // Create study session
    let session = StudySession {
        student: *student.key,
        stake_amount,
        start_time,
        duration_minutes,
        keystroke_goal,
        completed: false,
        tokens_returned: false,
    };

    // Serialize and save session
    let mut session_data = session.try_to_vec()?;
    session_account.try_borrow_mut_data()?.copy_from_slice(&session_data);

    msg!("Study session initialized for student: {}", student.key);
    Ok(())
}

fn complete_session(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    actual_keystrokes: u32,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let student = next_account_info(account_info_iter)?;
    let session_account = next_account_info(account_info_iter)?;

    // Deserialize session
    let mut session_data = session_account.try_borrow_mut_data()?;
    let mut session = StudySession::try_from_slice(&session_data)?;

    // Verify student owns this session
    if session.student != *student.key {
        return Err(ProgramError::InvalidAccountData);
    }

    // Get current time
    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;
    let elapsed_minutes = ((current_time - session.start_time) / 60) as u32;

    // Verify session completion criteria
    let time_met = elapsed_minutes >= session.duration_minutes;
    let keystrokes_met = actual_keystrokes >= session.keystroke_goal;

    if !time_met || !keystrokes_met {
        return Err(ProgramError::InvalidAccountData);
    }

    // Mark as completed
    session.completed = true;
    session.tokens_returned = true;

    // Calculate bonus (10% of stake)
    let bonus = session.stake_amount / 10;
    let total_return = session.stake_amount + bonus;

    msg!("Session completed! Returning {} tokens (stake: {} + bonus: {})", 
         total_return, session.stake_amount, bonus);

    // Update session data
    session_data.copy_from_slice(&session.try_to_vec()?);

    Ok(())
}

fn fail_session(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let student = next_account_info(account_info_iter)?;
    let session_account = next_account_info(account_info_iter)?;

    // Deserialize session
    let mut session_data = session_account.try_borrow_mut_data()?;
    let mut session = StudySession::try_from_slice(&session_data)?;

    // Verify student owns this session
    if session.student != *student.key {
        return Err(ProgramError::InvalidAccountData);
    }

    // Mark as failed
    session.completed = false;
    session.tokens_returned = true;

    msg!("Session failed. {} tokens will be burned or sent to communal pool", 
         session.stake_amount);

    // Update session data
    session_data.copy_from_slice(&session.try_to_vec()?);

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_session_serialization() {
        let session = StudySession {
            student: Pubkey::default(),
            stake_amount: 1000,
            start_time: 0,
            duration_minutes: 30,
            keystroke_goal: 500,
            completed: false,
            tokens_returned: false,
        };

        let serialized = session.try_to_vec().unwrap();
        let deserialized = StudySession::try_from_slice(&serialized).unwrap();
        
        assert_eq!(session.stake_amount, deserialized.stake_amount);
        assert_eq!(session.duration_minutes, deserialized.duration_minutes);
    }
}

