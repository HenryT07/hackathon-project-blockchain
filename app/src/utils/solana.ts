import { PublicKey, Transaction, SystemProgram, Connection } from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// Replace with your deployed program ID
export const PROGRAM_ID = new PublicKey('11111111111111111111111111111111');

export interface StudySessionConfig {
  stakeAmount: number;
  durationMinutes: number;
  keystrokeGoal: number;
}

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: number): number {
  return sol * LAMPORTS_PER_SOL;
}

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}

/**
 * Create a transaction to initialize a study session
 * Note: This is a placeholder - implement proper program interaction
 */
export async function createInitializeSessionTransaction(
  connection: Connection,
  payer: PublicKey,
  config: StudySessionConfig
): Promise<Transaction> {
  const transaction = new Transaction();
  
  // TODO: Replace with actual program instruction
  // For now, this is a placeholder that would need to be replaced
  // with actual program instruction calls
  
  return transaction;
}

/**
 * Create a transaction to complete a study session
 */
export async function createCompleteSessionTransaction(
  connection: Connection,
  payer: PublicKey,
  sessionAccount: PublicKey,
  actualKeystrokes: number
): Promise<Transaction> {
  const transaction = new Transaction();
  
  // TODO: Replace with actual program instruction
  
  return transaction;
}

/**
 * Create a transaction to fail a study session
 */
export async function createFailSessionTransaction(
  connection: Connection,
  payer: PublicKey,
  sessionAccount: PublicKey
): Promise<Transaction> {
  const transaction = new Transaction();
  
  // TODO: Replace with actual program instruction
  
  return transaction;
}

