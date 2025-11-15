'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect, useCallback, useRef } from 'react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface StudySession {
  stakeAmount: number;
  durationMinutes: number;
  keystrokeGoal: number;
  startTime: number | null;
  elapsedSeconds: number;
  keystrokes: number;
  isActive: boolean;
  completed: boolean;
}

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [session, setSession] = useState<StudySession>({
    stakeAmount: 0.1,
    durationMinutes: 30,
    keystrokeGoal: 500,
    startTime: null,
    elapsedSeconds: 0,
    keystrokes: 0,
    isActive: false,
    completed: false,
  });
  const [totalStaked, setTotalStaked] = useState<number>(0);
  const [totalRewarded, setTotalRewarded] = useState<number>(0);
  const [communalPool, setCommunalPool] = useState<number>(0);
  const keystrokeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch wallet balance
  useEffect(() => {
    if (publicKey) {
      const fetchBalance = async () => {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };
      fetchBalance();
      const interval = setInterval(fetchBalance, 5000);
      return () => clearInterval(interval);
    }
  }, [publicKey, connection]);

  // Keystroke tracking
  useEffect(() => {
    if (!session.isActive) return;

    const handleKeyPress = () => {
      keystrokeRef.current += 1;
      setSession(prev => ({ ...prev, keystrokes: keystrokeRef.current }));
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [session.isActive]);

  // Timer
  useEffect(() => {
    if (!session.isActive || !session.startTime) return;

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - session.startTime!) / 1000);
      setSession(prev => ({ ...prev, elapsedSeconds: elapsed }));

      // Check if session duration is complete
      if (elapsed >= session.durationMinutes * 60) {
        handleCompleteSession();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session.isActive, session.startTime, session.durationMinutes]);

  const handleStakeAndStart = useCallback(async () => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const stakeAmountLamports = session.stakeAmount * LAMPORTS_PER_SOL;
      
      // Create a simple transfer transaction as a placeholder
      // In production, this would interact with your Solana program
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('11111111111111111111111111111111'), // Placeholder
          lamports: stakeAmountLamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      // Start session
      setSession(prev => ({
        ...prev,
        startTime: Date.now(),
        isActive: true,
        keystrokes: 0,
        elapsedSeconds: 0,
      }));
      keystrokeRef.current = 0;
      setTotalStaked(prev => prev + session.stakeAmount);

      alert(`Session started! Staked ${session.stakeAmount} SOL`);
    } catch (error) {
      console.error('Error staking:', error);
      alert('Failed to stake tokens. Please try again.');
    }
  }, [publicKey, sendTransaction, connection, session.stakeAmount]);

  const handleFailSession = useCallback(async () => {
    if (!publicKey) return;

    // 50% burn, 50% to communal pool
    const burnAmount = session.stakeAmount * 0.5;
    const poolAmount = session.stakeAmount * 0.5;

    setCommunalPool(prev => prev + poolAmount);
    setSession(prev => ({
      ...prev,
      isActive: false,
      completed: false,
    }));

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    alert(`Session failed. ${burnAmount.toFixed(4)} SOL burned, ${poolAmount.toFixed(4)} SOL added to communal pool.`);
  }, [publicKey, session.stakeAmount]);

  const handleCompleteSession = useCallback(async () => {
    if (!publicKey || !session.isActive) return;

    const timeMet = session.elapsedSeconds >= session.durationMinutes * 60;
    const keystrokesMet = session.keystrokes >= session.keystrokeGoal;

    if (timeMet && keystrokesMet) {
      // Calculate reward (stake + 10% bonus)
      const bonus = session.stakeAmount * 0.1;
      const totalReward = session.stakeAmount + bonus;

      try {
        // In production, this would interact with your Solana program
        // For now, we'll simulate the reward
        setTotalRewarded(prev => prev + totalReward);
        setSession(prev => ({
          ...prev,
          isActive: false,
          completed: true,
        }));

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        alert(`Session completed! You earned ${totalReward.toFixed(4)} SOL (${session.stakeAmount.toFixed(4)} stake + ${bonus.toFixed(4)} bonus)`);
      } catch (error) {
        console.error('Error completing session:', error);
        alert('Failed to claim rewards. Please try again.');
      }
    } else {
      handleFailSession();
    }
  }, [publicKey, session, handleFailSession]);

  const handleStopSession = useCallback(() => {
    if (session.isActive) {
      handleFailSession();
    }
  }, [session.isActive, handleFailSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = session.durationMinutes > 0 
    ? Math.min((session.elapsedSeconds / (session.durationMinutes * 60)) * 100, 100)
    : 0;
  const keystrokeProgress = session.keystrokeGoal > 0
    ? Math.min((session.keystrokes / session.keystrokeGoal) * 100, 100)
    : 0;

  return (
    <div className="container">
      <h1>📚 Study Commitment Staking System</h1>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <WalletMultiButton />
      </div>

      {publicKey && (
        <div className="card">
          <h2>Wallet Balance</h2>
          <div className="stat-value">{balance.toFixed(4)} SOL</div>
        </div>
      )}

      <div className="stats">
        <div className="stat-card">
          <div className="stat-value">{totalStaked.toFixed(4)}</div>
          <div className="stat-label">Total Staked</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalRewarded.toFixed(4)}</div>
          <div className="stat-label">Total Rewarded</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{communalPool.toFixed(4)}</div>
          <div className="stat-label">Communal Pool</div>
        </div>
      </div>

      <div className={`card ${session.isActive ? 'session-active' : ''}`}>
        <h2>Study Session</h2>
        
        {!session.isActive ? (
          <>
            <div>
              <label>Stake Amount (SOL):</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={session.stakeAmount}
                onChange={(e) => setSession(prev => ({ ...prev, stakeAmount: parseFloat(e.target.value) || 0.1 }))}
                disabled={session.isActive}
              />
            </div>
            <div>
              <label>Duration (minutes):</label>
              <input
                type="number"
                min="1"
                value={session.durationMinutes}
                onChange={(e) => setSession(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) || 30 }))}
                disabled={session.isActive}
              />
            </div>
            <div>
              <label>Keystroke Goal:</label>
              <input
                type="number"
                min="1"
                value={session.keystrokeGoal}
                onChange={(e) => setSession(prev => ({ ...prev, keystrokeGoal: parseInt(e.target.value) || 500 }))}
                disabled={session.isActive}
              />
            </div>
            <button onClick={handleStakeAndStart} disabled={!publicKey || session.isActive}>
              Stake & Start Session
            </button>
          </>
        ) : (
          <>
            <div className="timer">{formatTime(session.elapsedSeconds)}</div>
            <div className="keystroke-counter">
              Keystrokes: {session.keystrokes} / {session.keystrokeGoal}
            </div>
            
            <div style={{ margin: '1rem 0' }}>
              <div style={{ marginBottom: '0.5rem' }}>Time Progress:</div>
              <div style={{ 
                width: '100%', 
                height: '20px', 
                background: '#e0e0e0', 
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>

            <div style={{ margin: '1rem 0' }}>
              <div style={{ marginBottom: '0.5rem' }}>Keystroke Progress:</div>
              <div style={{ 
                width: '100%', 
                height: '20px', 
                background: '#e0e0e0', 
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${keystrokeProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #2196f3, #03a9f4)',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button onClick={handleCompleteSession} style={{ marginRight: '1rem', background: '#4caf50' }}>
                Complete Session
              </button>
              <button onClick={handleStopSession} style={{ background: '#f44336' }}>
                Stop & Fail Session
              </button>
            </div>

            <div className="info" style={{ marginTop: '1rem' }}>
              Keep typing to reach your keystroke goal! Session will auto-complete when time and keystroke goals are met.
            </div>
          </>
        )}

        {session.completed && !session.isActive && (
          <div className="success" style={{ marginTop: '1rem' }}>
            ✅ Session completed successfully! Rewards have been distributed.
          </div>
        )}
      </div>

      <div className="card">
        <h2>How It Works</h2>
        <ol style={{ lineHeight: '2', paddingLeft: '1.5rem' }}>
          <li>Connect your Phantom wallet</li>
          <li>Set your stake amount, study duration, and keystroke goal</li>
          <li>Stake tokens and start your study session</li>
          <li>Study actively - the app tracks your keystrokes and time</li>
          <li>Complete the session to get your stake back + 10% bonus</li>
          <li>If you fail, 50% of tokens burn and 50% go to the communal pool</li>
        </ol>
      </div>
    </div>
  );
}

