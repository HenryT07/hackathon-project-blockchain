use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("YourProgramIdHere"); // Replace with your deployed program ID

#[program]
pub mod trivia_game {
    use super::*;

    /// Initialize the game state
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        game_state.prize_pool = 0;
        game_state.hash_difficulty = 4;
        game_state.owner = ctx.accounts.owner.key();
        game_state.leaderboard_count = 0;
        Ok(())
    }

    /// Submit a hash attempt
    pub fn submit_hash_attempt(
        ctx: Context<SubmitHash>,
        hash: [u8; 32],
        successful: bool,
    ) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        
        if !successful {
            // Contribute to prize pool (0.001 SOL per failed hash)
            let contribution = 1_000_000; // 0.001 SOL in lamports
            require!(
                ctx.accounts.player.to_account_info().lamports() >= contribution,
                TriviaGameError::InsufficientFunds
            );
            
            // Transfer lamports to prize pool
            **ctx.accounts.player.to_account_info().try_borrow_mut_lamports()? -= contribution;
            **game_state.to_account_info().try_borrow_mut_lamports()? += contribution;
            game_state.prize_pool += contribution;
        }

        emit!(HashAttemptEvent {
            player: ctx.accounts.player.key(),
            hash,
            successful,
        });

        Ok(())
    }

    /// Submit score to leaderboard
    pub fn submit_score(
        ctx: Context<SubmitScore>,
        score: u64,
        successful_hashes: u64,
    ) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        let player = ctx.accounts.player.key();

        // Check if player already has a score
        let mut found = false;
        let mut index = 0;
        
        for (i, entry) in game_state.leaderboard.iter().enumerate() {
            if entry.player == player {
                found = true;
                index = i;
                break;
            }
        }

        let player_score = PlayerScore {
            player,
            score,
            successful_hashes,
            timestamp: Clock::get()?.unix_timestamp,
        };

        if found {
            // Update existing score if new score is better
            if score > game_state.leaderboard[index].score {
                game_state.leaderboard[index] = player_score;
                // Re-sort leaderboard
                game_state.leaderboard.sort_by(|a, b| b.score.cmp(&a.score));
            }
        } else {
            // Add new entry
            if game_state.leaderboard_count < MAX_LEADERBOARD_SIZE {
                game_state.leaderboard.push(player_score);
                game_state.leaderboard_count += 1;
            } else {
                // Check if score is better than worst entry
                let worst_score = game_state.leaderboard.last().unwrap().score;
                if score > worst_score {
                    game_state.leaderboard.pop();
                    game_state.leaderboard.push(player_score);
                }
            }
            // Sort leaderboard
            game_state.leaderboard.sort_by(|a, b| b.score.cmp(&a.score));
        }

        emit!(ScoreSubmittedEvent {
            player,
            score,
            successful_hashes,
        });

        Ok(())
    }

    /// Claim prize (top player can claim)
    pub fn claim_prize(ctx: Context<ClaimPrize>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        let player = ctx.accounts.player.key();

        require!(
            game_state.leaderboard.len() > 0,
            TriviaGameError::NoPlayers
        );
        require!(
            game_state.leaderboard[0].player == player,
            TriviaGameError::NotTopPlayer
        );
        require!(
            game_state.prize_pool >= MIN_PRIZE_CLAIM,
            TriviaGameError::PrizePoolTooSmall
        );

        let prize_amount = game_state.prize_pool;
        game_state.prize_pool = 0;

        // Transfer prize to player
        **game_state.to_account_info().try_borrow_mut_lamports()? -= prize_amount;
        **ctx.accounts.player.to_account_info().try_borrow_mut_lamports()? += prize_amount;

        emit!(PrizeClaimedEvent {
            winner: player,
            amount: prize_amount,
        });

        Ok(())
    }
}

// Constants
const MAX_LEADERBOARD_SIZE: usize = 100;
const MIN_PRIZE_CLAIM: u64 = 10_000_000; // 0.01 SOL in lamports

// Accounts
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + GameState::LEN,
        seeds = [b"game_state"],
        bump
    )]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitHash<'info> {
    #[account(mut, seeds = [b"game_state"], bump)]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct SubmitScore<'info> {
    #[account(mut, seeds = [b"game_state"], bump)]
    pub game_state: Account<'info, GameState>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimPrize<'info> {
    #[account(mut, seeds = [b"game_state"], bump)]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
}

// Account Structures
#[account]
pub struct GameState {
    pub owner: Pubkey,
    pub prize_pool: u64,
    pub hash_difficulty: u8,
    pub leaderboard_count: u8,
    pub leaderboard: Vec<PlayerScore>,
}

impl GameState {
    pub const LEN: usize = 32 + 8 + 1 + 1 + 4 + (100 * PlayerScore::LEN);
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct PlayerScore {
    pub player: Pubkey,
    pub score: u64,
    pub successful_hashes: u64,
    pub timestamp: i64,
}

impl PlayerScore {
    pub const LEN: usize = 32 + 8 + 8 + 8;
}

// Events
#[event]
pub struct HashAttemptEvent {
    pub player: Pubkey,
    pub hash: [u8; 32],
    pub successful: bool,
}

#[event]
pub struct ScoreSubmittedEvent {
    pub player: Pubkey,
    pub score: u64,
    pub successful_hashes: u64,
}

#[event]
pub struct PrizeClaimedEvent {
    pub winner: Pubkey,
    pub amount: u64,
}

// Errors
#[error_code]
pub enum TriviaGameError {
    #[msg("Insufficient funds to contribute to prize pool")]
    InsufficientFunds,
    #[msg("No players in leaderboard")]
    NoPlayers,
    #[msg("Only top player can claim prize")]
    NotTopPlayer,
    #[msg("Prize pool too small to claim")]
    PrizePoolTooSmall,
}

