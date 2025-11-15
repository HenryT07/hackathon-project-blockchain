# Full Program Integration Example

This document shows how to fully integrate the Solana program with the frontend.

## Current Status

The current implementation uses placeholder transactions. To fully integrate with the deployed Solana program, you'll need to:

1. Deploy the program and get the program ID
2. Create proper instruction serialization
3. Set up PDA (Program Derived Address) accounts
4. Implement proper token transfers

## Example Integration Code

Here's an example of how to properly call the program:

```typescript
import { 
  PublicKey, 
  Transaction, 
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import { Program, AnchorProvider, Wallet } from '@project-serum/anchor';
import { BN } from '@project-serum/anchor';

// Your deployed program ID
const PROGRAM_ID = new PublicKey('YOUR_PROGRAM_ID_HERE');

// Instruction data structure (matches Rust enum)
enum StudyStakingInstruction {
  InitializeSession = 0,
  CompleteSession = 1,
  FailSession = 2,
}

async function initializeSession(
  connection: Connection,
  wallet: Wallet,
  stakeAmount: number,
  durationMinutes: number,
  keystrokeGoal: number
) {
  // Create PDA for session account
  const [sessionPDA] = await PublicKey.findProgramAddress(
    [
      Buffer.from('study_session'),
      wallet.publicKey.toBuffer(),
      Buffer.from(Date.now().toString()),
    ],
    PROGRAM_ID
  );

  // Serialize instruction data
  const instructionData = Buffer.alloc(1 + 8 + 4 + 4);
  instructionData.writeUInt8(StudyStakingInstruction.InitializeSession, 0);
  instructionData.writeBigUInt64LE(BigInt(stakeAmount * LAMPORTS_PER_SOL), 1);
  instructionData.writeUInt32LE(durationMinutes, 9);
  instructionData.writeUInt32LE(keystrokeGoal, 13);

  // Create instruction
  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: sessionPDA, isSigner: false, isWritable: true },
      // Add other required accounts (token accounts, etc.)
    ],
    data: instructionData,
  });

  // Create and send transaction
  const transaction = new Transaction().add(instruction);
  const signature = await connection.sendTransaction(
    transaction,
    [wallet],
    { skipPreflight: false }
  );

  await connection.confirmTransaction(signature);
  return { sessionPDA, signature };
}

async function completeSession(
  connection: Connection,
  wallet: Wallet,
  sessionPDA: PublicKey,
  actualKeystrokes: number
) {
  const instructionData = Buffer.alloc(1 + 4);
  instructionData.writeUInt8(StudyStakingInstruction.CompleteSession, 0);
  instructionData.writeUInt32LE(actualKeystrokes, 1);

  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: sessionPDA, isSigner: false, isWritable: true },
      // Add reward token accounts
    ],
    data: instructionData,
  });

  const transaction = new Transaction().add(instruction);
  const signature = await connection.sendTransaction(
    transaction,
    [wallet]
  );

  await connection.confirmTransaction(signature);
  return signature;
}
```

## Using Anchor Framework (Recommended)

For easier development, consider using Anchor framework:

1. Install Anchor: `cargo install --git https://github.com/coral-xyz/anchor avm --locked --force`
2. Convert your program to use Anchor
3. Generate TypeScript client with `anchor build`
4. Use the generated client in your frontend

## Token Program Integration

For proper token staking, you'll need to:

1. Create or use an existing SPL Token
2. Create associated token accounts for staking
3. Transfer tokens to program-controlled accounts
4. Distribute rewards using token transfers

Example:

```typescript
import { 
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

// Get token accounts
const studentTokenAccount = await getAssociatedTokenAddress(
  tokenMint,
  studentPublicKey
);

const programTokenAccount = await getAssociatedTokenAddress(
  tokenMint,
  programPDA
);

// Create transfer instruction
const transferInstruction = createTransferInstruction(
  studentTokenAccount,
  programTokenAccount,
  studentPublicKey,
  stakeAmount,
  [],
  TOKEN_PROGRAM_ID
);
```

## Next Steps

1. Deploy the program to devnet
2. Update `app/src/utils/solana.ts` with your program ID
3. Implement proper instruction serialization
4. Add PDA account creation
5. Integrate SPL Token program
6. Test thoroughly on devnet before mainnet

