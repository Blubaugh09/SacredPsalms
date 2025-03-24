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
  user-select: none; /* Prevent default text selection */
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  
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
  
  // States for drag selection
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStartIndex, setSelectionStartIndex] = useState<number | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [selectionGroupCounter, setSelectionGroupCounter] = useState(1);
  const [phrases, setPhrases] = useState<HighlightedPhrase[]>([]);
  const [lastTapTime, setLastTapTime] = useState(0);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Add these new state variables
  const [dragDistance, setDragDistance] = useState(0);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  
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
  
  // Group highlighted words into phrases
  useEffect(() => {
    // Group words by their groupId
    const groups = new Map<number | undefined, HighlightedWord[]>();
    
    highlightedWords.forEach(word => {
      const groupId = word.groupId || 0; // Use 0 for ungrouped words
      if (!groups.has(groupId)) {
        groups.set(groupId, []);
      }
      groups.get(groupId)?.push(word);
    });
    
    // Sort words within each group by index
    const sortedPhrases: HighlightedPhrase[] = [];
    
    groups.forEach((words, groupId) => {
      // Sort words in the group by their index to maintain sentence order
      const sortedWords = [...words].sort((a, b) => a.index - b.index);
      
      // For single words or ungrouped words
      if (groupId === 0 || sortedWords.length === 1) {
        sortedWords.forEach(word => {
          sortedPhrases.push({
            words: [word],
            text: word.word
          });
        });
      } else {
        // For multi-word phrases
        const phraseText = sortedWords.map(w => w.word).join(' ');
        sortedPhrases.push({
          words: sortedWords,
          text: phraseText
        });
      }
    });
    
    // Sort phrases by the index of their first word
    sortedPhrases.sort((a, b) => {
      const aIndex = a.words[0]?.index || 0;
      const bIndex = b.words[0]?.index || 0;
      return aIndex - bIndex;
    });
    
    setPhrases(sortedPhrases);
  }, [highlightedWords]);
  
  // Handle taps with a small delay to differentiate between taps and drag starts
  const handleTap = (word: string, index: number) => {
    const now = Date.now();
    const isDoubleTap = now - lastTapTime < 300;
    setLastTapTime(now);
    
    // Clear any existing timeout
    if (tapTimeout.current) {
      clearTimeout(tapTimeout.current);
    }
    
    // If it's a double-tap, handle it immediately
    if (isDoubleTap) {
      handleWordClick(word, index);
      return;
    }
    
    // For single taps, wait a bit to make sure it's not the start of a drag
    tapTimeout.current = setTimeout(() => {
      if (!isSelecting) {
        handleWordClick(word, index);
      }
    }, 150);
  };
  
  // Simplified handler for word click/tap
  const handleWordClick = (word: string, index: number, event?: React.MouseEvent | React.TouchEvent) => {
    // If the event exists, prevent default behavior
    if (event) {
      event.preventDefault();
    }
    
    // If already highlighted, remove highlight
    if (highlightedWords.some(hw => hw.index === index)) {
      removeHighlight(index);
    } else {
      // Otherwise, add highlight (with no groupId for individual selections)
      highlightWord(word, index);
    }
  };
  
  // Handle selection start (mouse down or touch start)
  const handleSelectionStart = (index: number, event: React.MouseEvent | React.TouchEvent) => {
    // Capture start position for measuring drag distance
    if ('touches' in event) {
      // Touch event
      const touch = event.touches[0];
      setDragStartPosition({ x: touch.clientX, y: touch.clientY });
    } else {
      // Mouse event
      setDragStartPosition({ x: event.clientX, y: event.clientY });
    }
    
    setDragDistance(0);
    setIsSelecting(true);
    setSelectionStartIndex(index);
    setSelectedIndices(new Set([index]));
  };
  
  // Handle selection movement
  const handleSelectionMove = (index: number, event?: React.MouseEvent | React.TouchEvent) => {
    if (!isSelecting || selectionStartIndex === null) return;
    
    // Calculate drag distance
    if (event) {
      let currentX = 0, currentY = 0;
      
      if ('touches' in event) {
        // Touch event
        const touch = event.touches[0];
        currentX = touch.clientX;
        currentY = touch.clientY;
      } else {
        // Mouse event
        currentX = event.clientX;
        currentY = event.clientY;
      }
      
      const distance = Math.sqrt(
        Math.pow(currentX - dragStartPosition.x, 2) + 
        Math.pow(currentY - dragStartPosition.y, 2)
      );
      
      setDragDistance(distance);
    }
    
    // Determine the range of indices to select
    const start = Math.min(selectionStartIndex, index);
    const end = Math.max(selectionStartIndex, index);
    
    // Create a new set with all indices in the range
    const newSelectedIndices = new Set<number>();
    for (let i = start; i <= end; i++) {
      // Only add indices that correspond to actual words (not spaces)
      const wordAtIndex = words.find(w => w.index === i);
      if (wordAtIndex && wordAtIndex.text.trim() !== '') {
        newSelectedIndices.add(i);
      }
    }
    
    setSelectedIndices(newSelectedIndices);
  };
  
  // Handle selection end (mouse up or touch end)
  const handleSelectionEnd = (event?: React.MouseEvent | React.TouchEvent) => {
    if (!isSelecting) return;
    
    // If it was just a tap/click (very little movement), handle as a single word click
    if (dragDistance < 10 && selectedIndices.size <= 1 && selectionStartIndex !== null) {
      const wordObj = words.find(w => w.index === selectionStartIndex);
      if (wordObj) {
        handleWordClick(wordObj.text, selectionStartIndex, event);
      }
      
      // Reset selection state
      setIsSelecting(false);
      setSelectionStartIndex(null);
      setSelectedIndices(new Set());
      return;
    }
    
    // Only treat as a multi-select if more than one word is selected
    const isMultiSelect = selectedIndices.size > 1;
    const currentGroupId = isMultiSelect ? selectionGroupCounter : undefined;
    
    // Apply highlights to all selected words
    selectedIndices.forEach(index => {
      const wordObj = words.find(w => w.index === index);
      if (wordObj) {
        // Skip if already highlighted
        if (!highlightedWords.some(hw => hw.index === index)) {
          // Pass the groupId for multi-selections
          highlightWord(wordObj.text, index, currentGroupId);
        }
      }
    });
    
    // Increment group counter for next selection
    if (isMultiSelect) {
      setSelectionGroupCounter(prev => prev + 1);
    }
    
    // Reset selection state
    setIsSelecting(false);
    setSelectionStartIndex(null);
    setSelectedIndices(new Set());
  };
  
  // Handle cancel selection
  const handleSelectionCancel = () => {
    setIsSelecting(false);
    setSelectionStartIndex(null);
    setSelectedIndices(new Set());
  };
  
  const handleRestart = () => {
    // Reset animation states before resetting session
    setAnimateWords(false);
    setShowReflection(false);
    resetSession();
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Prevent default text selection behavior
  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };
    
    // Add event listeners to prevent text selection
    document.addEventListener('selectstart', preventDefault);
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('selectstart', preventDefault);
    };
  }, []);
  
  return (
    <ReadingContainer>
      <ScriptureCard>
        <ScriptureReference>
          {simplifiedReference} ({scripture.translation})
        </ScriptureReference>
        
        <ScriptureText
          onMouseLeave={handleSelectionCancel}
          onTouchCancel={handleSelectionCancel}
        >
          {words.map((word, idx) => {
            // Skip rendering spaces as clickable spans
            if (word.text.trim() === '') {
              return word.text;
            }
            
            const isHighlighted = highlightedWords.some(hw => hw.index === word.index);
            const isCurrentlySelected = selectedIndices.has(word.index);
            
            return (
              <WordSpan
                key={idx}
                $isHighlighted={isHighlighted || isCurrentlySelected}
                onMouseDown={(e) => handleSelectionStart(word.index, e)}
                onMouseMove={(e) => handleSelectionMove(word.index, e)}
                onMouseUp={(e) => handleSelectionEnd(e)}
                onTouchStart={(e) => handleSelectionStart(word.index, e)}
                onTouchMove={(e) => {
                  // Get the element at the touch position
                  const touch = e.touches[0];
                  const element = document.elementFromPoint(touch.clientX, touch.clientY);
                  
                  // Find the index of the word that was touched
                  const wordIndex = element?.getAttribute('data-index');
                  if (wordIndex) {
                    handleSelectionMove(parseInt(wordIndex), e);
                  }
                }}
                onTouchEnd={(e) => handleSelectionEnd(e)}
                data-index={word.index}
              >
                {word.text}
              </WordSpan>
            );
          })}
        </ScriptureText>
      </ScriptureCard>
      
      <InstructionText>
        Click to highlight individual words or drag to highlight phrases. Scroll down to reflect.
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
          {phrases.map((phrase, index) => (
            <WordDisplay 
              key={index} 
              $delay={index * 1.2}
              $isVisible={animateWords}
            >
              {phrase.text}
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