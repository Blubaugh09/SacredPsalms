'use client';

import React from 'react';
import { useLectio } from '../context/LectioContext';
import { LectioStep } from '../types';
import { Card, TextArea, SectionTitle } from './StyledComponents';

const ReflectionInput: React.FC = () => {
  const { session, setReflections, setPrayers } = useLectio();
  const { currentStep, selectedText, reflections, prayers } = session;

  // Only show this component in specific steps
  if (![LectioStep.MEDITATIO, LectioStep.ORATIO].includes(currentStep)) {
    return null;
  }

  // Handle input changes based on current step
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (currentStep === LectioStep.MEDITATIO) {
      setReflections(e.target.value);
    } else if (currentStep === LectioStep.ORATIO) {
      setPrayers(e.target.value);
    }
  };

  return (
    <Card>
      {currentStep === LectioStep.MEDITATIO && (
        <>
          <SectionTitle>Reflect</SectionTitle>
          {selectedText ? (
            <>
              <p>You selected: <strong>"{selectedText}"</strong></p>
              <p>What is meaningful about this phrase to you? How might God be speaking through these words?</p>
            </>
          ) : (
            <p>Select a word or phrase from the scripture that speaks to you, then reflect on it here.</p>
          )}
          <TextArea 
            value={reflections || ''}
            onChange={handleInputChange}
            placeholder="Enter your reflections here..."
          />
        </>
      )}

      {currentStep === LectioStep.ORATIO && (
        <>
          <SectionTitle>Pray</SectionTitle>
          <p>Respond to God in prayer. How is this scripture inviting you to respond?</p>
          <TextArea 
            value={prayers || ''}
            onChange={handleInputChange}
            placeholder="Enter your prayer here..."
          />
        </>
      )}
    </Card>
  );
};

export default ReflectionInput; 