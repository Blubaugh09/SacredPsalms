'use client';

import React, { useState, useEffect } from 'react';
import { useMeditation } from '../context/MeditationContext';
import styled, { keyframes, css } from 'styled-components';

// Define animations
const breatheIn = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.3);
    opacity: 1;
  }
`;

const breatheOut = keyframes`
  0% {
    transform: scale(1.3);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulseAnimation = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

// Styled components
const BreathingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--background);
  z-index: 100;
  animation: ${fadeIn} 0.8s ease-in-out forwards;
`;

const BreathCircle = styled.div<{ $breathing: 'in' | 'out' | 'hold' | 'rest' }>`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent) 0%, var(--primary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  text-align: center;
  font-family: 'Cormorant Garamond', serif;
  box-shadow: 0 0 60px rgba(92, 64, 51, 0.3);
  transform: ${props => props.$breathing === 'hold' ? 'scale(1.3)' : 'scale(1)'};
  opacity: ${props => props.$breathing === 'hold' ? '1' : '0.3'};
  animation: ${props => {
    switch (props.$breathing) {
      case 'in':
        return css`${breatheIn} 3s ease-in-out forwards`;
      case 'out':
        return css`${breatheOut} 3s ease-in-out forwards`;
      case 'hold':
      case 'rest':
      default:
        return 'none';
    }
  }};
`;

const BreathProgressContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 2rem;
  opacity: 0.7;
`;

const BreathDot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$active ? 'var(--primary)' : 'var(--light-gray)'};
  opacity: ${props => props.$active ? 1 : 0.5};
  transition: all 0.3s ease;
`;

const BreathingSkip = styled.button`
  position: absolute;
  bottom: 9rem;
  background: none;
  border: none;
  color: var(--medium-gray);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.8rem 1.5rem;
  transition: all 0.3s ease;
  font-style: italic;
  
  &:hover {
    color: var(--primary);
  }
`;

const BreathingExercise: React.FC = () => {
  const { session, nextStep, incrementBreath, markBreathComplete } = useMeditation();
  const [breathState, setBreathState] = useState<'in' | 'out' | 'hold' | 'rest'>('rest');
  const [instruction, setInstruction] = useState('Get ready to breathe');
  const { breathCount } = session;
  
  // Breathing cycle
  useEffect(() => {
    // Skip breathing if already completed or if we've done 3 breaths
    if (session.breathCompleted || breathCount >= 3) {
      markBreathComplete();
      nextStep();
      return;
    }
    
    let timer: NodeJS.Timeout;
    
    const startBreathCycle = () => {
      // Begin breath in
      setBreathState('in');
      // Only show instructions for the first breath
      if (breathCount === 0) {
        setInstruction('Inhale');
      } else {
        setInstruction('');
      }
      
      // Hold breath
      timer = setTimeout(() => {
        setBreathState('hold');
        if (breathCount === 0) {
          setInstruction('Hold');
        }
        
        // Breathe out
        timer = setTimeout(() => {
          setBreathState('out');
          if (breathCount === 0) {
            setInstruction('Exhale');
          }
          
          // Rest before next cycle
          timer = setTimeout(() => {
            setBreathState('rest');
            incrementBreath();
            
            if (breathCount + 1 >= 3) {
              setInstruction('Well done');
              markBreathComplete();
              nextStep();
            } else {
              // Prepare for next breath cycle with brief pause 
              // while still showing the instruction
              timer = setTimeout(() => {
                startBreathCycle();
              },);
            }
          }, 3000);
        }, 1000);
      }, 3000);
    };
    
    // Start breathing sequence after a brief pause
    timer = setTimeout(() => {
      startBreathCycle();
    }, 2000); // Initial pause
    
    return () => clearTimeout(timer);
  }, [breathCount, incrementBreath, markBreathComplete, nextStep, session.breathCompleted]);
  
  const handleSkip = () => {
    markBreathComplete();
    nextStep();
  };
  
  return (
    <BreathingContainer>
      <BreathCircle $breathing={breathState}>
        {instruction}
      </BreathCircle>
      
      <BreathProgressContainer>
        <BreathDot $active={breathCount >= 0} />
        <BreathDot $active={breathCount >= 1} />
        <BreathDot $active={breathCount >= 2} />
      </BreathProgressContainer>
      
      <BreathingSkip onClick={handleSkip}>
        Skip to reading →
      </BreathingSkip>
    </BreathingContainer>
  );
};

export default BreathingExercise; 