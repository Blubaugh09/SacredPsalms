'use client';

import React, { useState, useEffect } from 'react';
import { useLectio } from '../context/LectioContext';
import { 
  Card, 
  Timer as TimerDisplay, 
  Button, 
  FlexColumn, 
  FlexRow,
  ProgressBar
} from './StyledComponents';

const Timer: React.FC = () => {
  const { session, updateTimer } = useLectio();
  const [timeLeft, setTimeLeft] = useState(session.timerDuration);
  const [isActive, setIsActive] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    return ((session.timerDuration - timeLeft) / session.timerDuration) * 100;
  };

  // Timer controls
  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(session.timerDuration);
    setHasCompleted(false);
  };

  // Adjust timer duration
  const adjustTime = (amount: number) => {
    const newTime = Math.max(30, session.timerDuration + amount);
    updateTimer(newTime);
    setTimeLeft(newTime);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setHasCompleted(true);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Update timeLeft when timerDuration changes
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(session.timerDuration);
    }
  }, [session.timerDuration, isActive]);

  return (
    <Card>
      <FlexColumn>
        <TimerDisplay>{formatTime(timeLeft)}</TimerDisplay>

        <ProgressBar $progress={calculateProgress()} />

        <FlexRow style={{ justifyContent: 'center' }}>
          {isActive ? (
            <Button onClick={pauseTimer}>Pause</Button>
          ) : (
            <Button onClick={startTimer} disabled={hasCompleted}>
              {hasCompleted ? 'Complete' : timeLeft === session.timerDuration ? 'Start' : 'Resume'}
            </Button>
          )}
          <Button $variant="outline" onClick={resetTimer}>Reset</Button>
        </FlexRow>

        <FlexRow style={{ justifyContent: 'center', marginTop: '1rem' }}>
          <Button 
            $variant="outline" 
            onClick={() => adjustTime(-30)}
            disabled={session.timerDuration <= 30}
          >
            -30s
          </Button>
          <Button 
            $variant="outline" 
            onClick={() => adjustTime(30)}
          >
            +30s
          </Button>
        </FlexRow>
      </FlexColumn>
    </Card>
  );
};

export default Timer; 