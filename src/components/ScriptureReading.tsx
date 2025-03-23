'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMeditation } from '../context/MeditationContext';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const wordFadeIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(40px); 
    filter: blur(8px);
  }
  20% {
    opacity: 0.3;
    filter: blur(4px);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0);
    filter: blur(0);
  }
`;

const pulseAnimation = keyframes`
  0% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
  100% { opacity: 0.5; transform: scale(1); }
`;

const ReadingContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  position: relative;
`;

const ScriptureCard = styled.div`
  position: relative;
  
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px var(--shadow);
  margin-bottom: 0rem;

  animation: ${fadeIn} 2s ease forwards;
`;

const ScriptureReference = styled.div`
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--primary);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ScriptureText = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem;
  line-height: 1.9;
  color: var(--card-foreground);
  text-align: left;
  white-space: normal;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
  }
`;

interface WordSpanProps {
  $isHighlighted: boolean;
}

const WordSpan = styled.span<WordSpanProps>`
  display: inline;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: ${props => props.$isHighlighted ? 'underline' : 'none'};
  text-decoration-color: var(--accent);
  text-decoration-thickness: 2px;
  padding: 0 2px;
  
  &:hover {
    color: var(--primary);
    background-color: var(--accent);
    border-radius: 2px;
  }
`;

const InstructionText = styled.p`
  text-align: center;
  font-style: italic;
  color: var(--primary);
  margin: 0rem 0;
  font-size: 1.1rem;
`;

const HighlightedWordsCount = styled.div`
  text-align: center;
  color: var(--medium-gray);
  margin-top: 1rem;
  font-size: 0.9rem;
  margin-bottom: 4rem; /* Add more space below the counter to encourage scrolling */
`;

const ScrollHintText = styled.p`
  text-align: center;
  font-style: italic;
  color: var(--medium-gray);
  margin: 2rem 0;
  font-size: 0.9rem;
  opacity: 0.8;
`;

// Reflection components
const ReflectionSection = styled.div<{ $isVisible: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.6s ease;
  margin-top: 0rem;
  border-top: 1px solid var(--light-gray);
  padding-top: 2rem;
  min-height: 300px; /* Ensure there's enough content space */
`;

const ReflectionTitle = styled.h2`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 2rem;
  text-align: center;
`;

const WordsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  width: 100%;
`;

interface WordDisplayProps {
  $delay: number;
  $isVisible: boolean;
}

const WordDisplay = styled.div<WordDisplayProps>`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem;
  color: var(--card-foreground);
  padding: 0.5rem 1.5rem;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow);
  opacity: 0;
  animation: ${props => props.$isVisible ? wordFadeIn : 'none'} 2s ease-out forwards;
  animation-delay: ${props => props.$delay}s;
  will-change: opacity, transform;
  transform: translateZ(0);
`;

const ReflectionPrompt = styled.p`
  text-align: center;
  font-style: italic;
  color: var(--primary);
  margin: 2rem 0;
  font-size: 1.1rem;
  max-width: 600px;
  line-height: 1.6;
`;

const PrayerReminder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  opacity: 0.7;
`;

const PrayerIcon = styled.div`
  margin-bottom: 0.5rem;
  animation: ${pulseAnimation} 3s ease-in-out infinite;
  
  img {
    width: 2rem;
    height: 2rem;
    filter: invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%);
    /* You can adjust the filter values to match your primary2 color */
    /* Or replace this with a simpler approach if you have the icon in the right color */
  }
`;

const PrayerText = styled.p`
  font-style: italic;
  font-size: 0.9rem;
  color: var(--medium-gray);
  letter-spacing: 0.5px;
`;

const RestartButton = styled.button`
  margin-top: 2rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-light);
  }
`;

const SpacerDiv = styled.div`
  height: 10px; /* Provides space for scrolling beyond the scripture */
`;

const ScriptureReading: React.FC = () => {
  const { session, highlightWord, removeHighlight, resetSession } = useMeditation();
  const { scripture, highlightedWords } = session;
  const [showReflection, setShowReflection] = useState(false);
  const [animateWords, setAnimateWords] = useState(false);
  const reflectionRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  
  // Format the reference to only show book and chapter
  const simplifiedReference = scripture.reference.split(':')[0];
  
  // Split scripture text into an array of words with their indices
  const [words, setWords] = useState<{ text: string; index: number }[]>([]);
  
  useEffect(() => {
    // Process the text to handle line breaks properly
    const preprocessText = (text: string) => {
      // Replace single line breaks with spaces to improve flow
      // But preserve paragraph breaks (double line breaks)
      const processedText = text.replace(/([^\n])\n([^\n])/g, '$1 $2');
      return processedText;
    };
    
    // Split text by spaces and punctuation but keep the punctuation attached to the words
    const regex = /[\w']+[.,;:!?]?|\s+|[.,;:!?]/g;
    const matches = preprocessText(scripture.text).match(regex) || [];
    
    const wordList = matches.map((match, index) => ({
      text: match,
      index
    }));
    
    setWords(wordList);
  }, [scripture.text]);

  // Scroll observer to show reflection when scrolled to
  useEffect(() => {
    if (!highlightedWords.length) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !showReflection) {
            setShowReflection(true);
            // Trigger word animations after a slight delay
            setTimeout(() => setAnimateWords(true), 500);
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the element is visible
    );
    
    if (spacerRef.current) {
      observer.observe(spacerRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [highlightedWords.length, showReflection]);
  
  const handleWordClick = (word: string, index: number) => {
    // If already highlighted, remove highlight
    if (highlightedWords.some(hw => hw.index === index)) {
      removeHighlight(index);
    } else {
      // Otherwise, add highlight
      highlightWord(word, index);
    }
  };
  
  const handleRestart = () => {
    // Reset animation states before resetting session
    setAnimateWords(false);
    setShowReflection(false);
    resetSession();
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Sort highlighted words by their index to maintain the original order
  const sortedWords = [...highlightedWords].sort((a, b) => a.index - b.index);
  
  return (
    <ReadingContainer>
      <ScriptureCard>
        <ScriptureReference>
          {simplifiedReference} ({scripture.translation})
        </ScriptureReference>
        
        <ScriptureText>
          {words.map((word, idx) => {
            // Skip rendering spaces as clickable spans
            if (word.text.trim() === '') {
              return word.text;
            }
            
            const isHighlighted = highlightedWords.some(hw => hw.index === word.index);
            
            return (
              <WordSpan
                key={idx}
                $isHighlighted={isHighlighted}
                onClick={() => handleWordClick(word.text, word.index)}
              >
                {word.text}
              </WordSpan>
            );
          })}
        </ScriptureText>
      </ScriptureCard>
      
      <InstructionText>
      </InstructionText>
      

      
      {highlightedWords.length > 0 && (
        <>
          <ScrollHintText>Scroll down to reflect on your highlighted words</ScrollHintText>
          <SpacerDiv ref={spacerRef} />
        </>
      )}
      
      <ReflectionSection 
        id="reflection-section" 
        $isVisible={showReflection && highlightedWords.length > 0}
        ref={reflectionRef}
      >
        <ReflectionTitle>Your Sacred Words</ReflectionTitle>
        
        <WordsContainer>
          {sortedWords.map((word, index) => (
            <WordDisplay 
              key={index} 
              $delay={index * 1.2}
              $isVisible={animateWords}
            >
              {word.word}
            </WordDisplay>
          ))}
        </WordsContainer>
        

        
        <PrayerReminder>
          <PrayerIcon>
            <img 
              src="/assets/prayer-icon.png" 
              alt="Prayer icon" 
            />
          </PrayerIcon>
          <PrayerText>Take a moment in silent prayer</PrayerText>
        </PrayerReminder>
        
        <RestartButton onClick={handleRestart}>
          Begin New Meditation
        </RestartButton>
      </ReflectionSection>
    </ReadingContainer>
  );
};

export default ScriptureReading; 