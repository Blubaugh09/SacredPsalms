'use client';

import React, { useState, useEffect } from 'react';
import { useLectio } from '../context/LectioContext';
import { ScriptureText, ScriptureReference, Card, HighlightedText } from './StyledComponents';
import { LectioStep } from '../types';
import styled from 'styled-components';

const ScriptureCard = styled(Card)`
  position: relative;
  border-left: 3px solid var(--accent);
  padding: 1.5rem 1.8rem;
  
  &::before {
    content: """;
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    font-size: 3rem;
    font-family: 'Cormorant Garamond', serif;
    color: var(--accent);
    opacity: 0.5;
    line-height: 1;
  }
`;

const PsalmNumber = styled.div`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent);
  opacity: 0.7;
`;

const EnhancedScriptureText = styled(ScriptureText)`
  text-indent: 1.5rem;
  line-height: 1.9;
  
  @media (min-width: 768px) {
    font-size: 1.7rem;
  }
  
  &::first-letter {
    font-size: 2em;
    font-weight: 700;
    color: var(--primary);
    font-family: 'Cormorant Garamond', serif;
  }
`;

const SelectionHint = styled.div`
  text-align: center;
  font-style: italic;
  font-size: 0.9rem;
  color: var(--primary);
  margin-top: 1rem;
  opacity: 0.8;
`;

const Scripture: React.FC = () => {
  const { session, setSelectedText } = useLectio();
  const { scripture, currentStep, selectedText } = session;
  const [displayText, setDisplayText] = useState<React.ReactNode>(scripture.text);

  // Extract Psalm number if available
  const psalmMatch = scripture.reference.match(/Psalm (\d+)/);
  const psalmNumber = psalmMatch ? psalmMatch[1] : null;

  // Handle text selection in Meditatio stage
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '') {
      setSelectedText(selection.toString().trim());
    }
  };

  // Highlight the selected text in Meditatio stage or after
  useEffect(() => {
    if (!selectedText || currentStep === LectioStep.LECTIO || currentStep === LectioStep.INTRO) {
      setDisplayText(scripture.text);
      return;
    }

    // Split text by the selected text to highlight it
    const segments = scripture.text.split(new RegExp(`(${selectedText})`, 'gi'));
    const highlighted = segments.map((segment, index) => {
      if (segment.toLowerCase() === selectedText.toLowerCase()) {
        return <HighlightedText key={index}>{segment}</HighlightedText>;
      }
      return segment;
    });

    setDisplayText(highlighted);
  }, [selectedText, scripture.text, currentStep]);

  return (
    <ScriptureCard>
      {psalmNumber && <PsalmNumber>{psalmNumber}</PsalmNumber>}
      <ScriptureReference>
        {scripture.reference} ({scripture.translation})
      </ScriptureReference>
      <EnhancedScriptureText 
        onMouseUp={currentStep === LectioStep.MEDITATIO ? handleTextSelection : undefined}
      >
        {displayText}
      </EnhancedScriptureText>
      
      {currentStep === LectioStep.MEDITATIO && !selectedText && (
        <SelectionHint>
          Select text that speaks to you
        </SelectionHint>
      )}
    </ScriptureCard>
  );
};

export default Scripture; 