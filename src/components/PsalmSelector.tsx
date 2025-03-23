'use client';

import React, { useState } from 'react';
import { useLectio } from '../context/LectioContext';
import { 
  Card, 
  FlexColumn,
  ScriptureReference
} from './StyledComponents';
import styled from 'styled-components';

const ScriptureSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin: 0.5rem 0;
`;

const PsalmInput = styled.input`
  padding: 0.6rem;
  border: 1px solid var(--light-gray);
  border-radius: 8px;
  font-size: 1.1rem;
  width: 60px;
  text-align: center;
  background-color: var(--card-background);
  color: var(--card-foreground);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const ScriptureButton = styled.button`
  font-family: 'Cormorant Garamond', serif;
  background: none;
  border: none;
  color: var(--primary);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  
  &:hover {
    background-color: var(--accent);
    color: var(--foreground);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RandomButton = styled.button`
  background: none;
  border: none;
  color: var(--primary);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-style: italic;
  
  &:hover {
    background-color: var(--accent);
    color: var(--foreground);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingDots = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 20px;
  
  &:after {
    content: "...";
    font-size: 1.4rem;
    color: var(--primary);
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { opacity: 0.2; }
    50% { opacity: 1; }
    100% { opacity: 0.2; }
  }
`;

const PsalmSelector: React.FC = () => {
  const { loadRandomPsalm, loadSpecificPsalm, isLoading, session } = useLectio();
  const [psalmNumber, setPsalmNumber] = useState<number>(23);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num) && num >= 1 && num <= 150) {
      setPsalmNumber(num);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && psalmNumber >= 1 && psalmNumber <= 150) {
      loadSpecificPsalm(psalmNumber);
    }
  };

  const handleRandomPsalm = () => {
    loadRandomPsalm();
  };

  const handleSpecificPsalm = () => {
    if (psalmNumber >= 1 && psalmNumber <= 150) {
      loadSpecificPsalm(psalmNumber);
    }
  };

  // Extract the current psalm number from the reference if possible
  const currentPsalmMatch = session.scripture.reference.match(/Psalm (\d+)/);
  const currentPsalm = currentPsalmMatch ? parseInt(currentPsalmMatch[1], 10) : null;

  return (
    <Card style={{ marginBottom: '1rem', padding: '1rem' }}>
      <FlexColumn style={{ gap: '0.5rem' }}>
        <ScriptureReference style={{ textAlign: 'center', margin: 0 }}>
          Sacred Reading of the Psalms
        </ScriptureReference>
        
        <ScriptureSelector>
          <span>Psalm</span>
          <PsalmInput 
            type="number"
            min="1"
            max="150"
            value={psalmNumber}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            aria-label="Enter Psalm number"
          />
          
          <ScriptureButton 
            onClick={handleSpecificPsalm}
            disabled={isLoading || psalmNumber < 1 || psalmNumber > 150}
          >
            Read
          </ScriptureButton>
          
          {isLoading ? (
            <LoadingDots />
          ) : (
            <RandomButton 
              onClick={handleRandomPsalm}
              disabled={isLoading}
              aria-label="Select random Psalm"
            >
              or random
            </RandomButton>
          )}
        </ScriptureSelector>
        
        {currentPsalm && (
          <div style={{ 
            fontSize: '0.85rem', 
            textAlign: 'center', 
            color: 'var(--medium-gray)',
            fontStyle: 'italic'
          }}>
            ESV translation · Psalms 1-150
          </div>
        )}
      </FlexColumn>
    </Card>
  );
};

export default PsalmSelector; 