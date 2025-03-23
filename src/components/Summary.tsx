'use client';

import React from 'react';
import { useLectio } from '../context/LectioContext';
import { LectioStep } from '../types';
import { 
  Card, 
  SectionTitle, 
  Button, 
  FlexRow,
  ScriptureReference
} from './StyledComponents';

const Summary: React.FC = () => {
  const { session, resetSession } = useLectio();
  const { currentStep, scripture, selectedText, reflections, prayers } = session;

  // Only show in conclusion step
  if (currentStep !== LectioStep.CONCLUSION) {
    return null;
  }

  // Handle creating a new session
  const handleNewSession = () => {
    resetSession();
  };

  return (
    <Card>
      <SectionTitle>Your Lectio Divina Journey</SectionTitle>
      
      <ScriptureReference>
        {scripture.reference} ({scripture.translation})
      </ScriptureReference>
      
      {selectedText && (
        <div style={{ margin: '1rem 0' }}>
          <h3>Highlighted Passage:</h3>
          <p style={{ fontStyle: 'italic', margin: '0.5rem 0' }}>"{selectedText}"</p>
        </div>
      )}
      
      {reflections && (
        <div style={{ margin: '1rem 0' }}>
          <h3>Your Reflections:</h3>
          <p style={{ whiteSpace: 'pre-line' }}>{reflections}</p>
        </div>
      )}
      
      {prayers && (
        <div style={{ margin: '1rem 0' }}>
          <h3>Your Prayer:</h3>
          <p style={{ whiteSpace: 'pre-line' }}>{prayers}</p>
        </div>
      )}
      
      <div style={{ margin: '1.5rem 0' }}>
        <p>
          "The Word is a lamp to my feet and a light to my path." – Psalm 119:105
        </p>
        <p style={{ marginTop: '1rem' }}>
          Take what you've received in prayer with you throughout your day. Consider returning to this reflection later.
        </p>
      </div>
      
      <FlexRow style={{ justifyContent: 'center', marginTop: '1rem' }}>
        <Button onClick={handleNewSession}>
          Begin New Lectio Divina Session
        </Button>
      </FlexRow>
    </Card>
  );
};

export default Summary; 