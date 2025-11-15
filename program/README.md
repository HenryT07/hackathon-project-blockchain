# Study Staking Solana Program

This is the Solana program (smart contract) for the Study Commitment Staking System.

## Building the Program

```bash
# Install Solana CLI if you haven't already
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Build the program
cargo build-sbf

# Deploy to devnet (for testing)
solana program deploy target/deploy/study_staking.so --url devnet
```

## Program Instructions

The program supports three main instructions:

1. **InitializeSession**: Creates a new study session with staking
2. **CompleteSession**: Completes a session and distributes rewards
3. **FailSession**: Handles failed sessions (burns tokens or sends to pool)

## Development

For local development, you can use Solana's local validator:

```bash
solana-test-validator
```

Then deploy to localhost:

```bash
solana program deploy target/deploy/study_staking.so --url localhost
```

