'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMeditation } from '../context/MeditationContext';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes
  from { opacity: 0; }
  to { opacity: 1; }
;

const wordFadeIn = keyframes
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
;

const pulseAnimation = keyframes
  0% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
  100% { opacity: 0.5; transform: scale(1); }
;

const ReadingContainer = styled.div
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  position: relative;
;

const ScriptureCard = styled.div
  position: relative;

  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px var(--shadow);
  margin-bottom: 0rem;

  animation: ${fadeIn} 2s ease forwards;
;

const ScriptureReference = styled.div
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--primary);
  margin-bottom: 1.5rem;
  text-align: center;
;

const ScriptureText = styled.div
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
;

interface WordSpanProps {
  $isHighlighted: boolean;
}

const WordSpan = styled.span<WordSpanProps>
  display: inline;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: ${props => props.$isHighlighted ? 'underline' : 'none'};
  text-decoration-color: var(--accent);
  text-decoration-thickness: 2px;
  padding: 0 2px;
;

const InstructionText = styled.p
  text-align: center;
  font-style: italic;
  color: var(--primary);
  margin: 0rem 0;
  font-size: 1.1rem;
;

const HighlightedWordsCount = styled.div
  text-align: center;
  color: var(--medium-gray);
  margin-top: 1rem;
  font-size: 0.9rem;
  margin-bottom: 4rem; /* Add more space below the counter to encourage scrolling */
;

const ScrollHintText = styled.p
  text-align: center;
  font-style: italic;
  color: var(--medium-gray);
  margin: 2rem 0;
  font-size: 0.9rem;
  opacity: 0.8;
;

// Reflection components
const ReflectionSection = styled.div<{ $isVisible: boolean }>
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
;

const ReflectionTitle = styled.h2
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 2rem;
  text-align: center;
;

const WordsContainer = styled.div
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  width: 100%;
;

interface WordDisplayProps {
  $delay: number;
  $isVisible: boolean;
}

const WordDisplay = styled.div<WordDisplayProps>
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
;

const ReflectionPrompt = styled.p
  text-align: center;
  font-style: italic;
  color: var(--primary);
  margin: 2rem 0;
  font-size: 1.1rem;
  max-width: 600px;
  line-height: 1.6;
;

const PrayerReminder = styled.div
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  opacity: 0.7;
;

const PrayerIcon = styled.div
  margin-bottom: 0.5rem;
  animation: ${pulseAnimation} 3s ease-in-out infinite;

  img {
    width: 2rem;
    height: 2rem;
    filter: invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%);
    /* You can adjust the filter values to match your primary2 color */
    /* Or replace this with a simpler approach if you have the icon in the right color */
  }
;

const PrayerText = styled.p
  font-style: italic;
  font-size: 0.9rem;
  color: var(--medium-gray);
  letter-spacing: 0.5px;
;

const RestartButton = styled.button
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
;

const SpacerDiv = styled.div
  height: 10px; /* Provides space for scrolling beyond the scripture */
;

interface HighlightedWord {
  word: string;
  index: number;
  groupId?: number;
}

interface HighlightedPhrase {
  words: HighlightedWord;
  text: string;
}

const ScriptureReading: React.FC = () => {
  const { session, highlightWord, removeHighlight, resetSession } = useMeditation();
  const { scripture, highlightedWords } = session;
  const = useState(false);
  const [animateWords, setAnimateWords] = useState(false);
  const reflectionRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  // Selection states
  const = useState(false);
  const = useState<number | null>(null);
  const = useState<Set<number>>(new Set());
  const = useState(1);
  const [phrases, setPhrases] = useState<HighlightedPhrase>();
  const = useState(0);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);

  // Touch handling variables
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isScrollingRef = useRef(false);
  const lastHighlightedIndex = useRef<number | null>(null); // To track the last highlighted word during drag

  // Store layout information for words
  const wordLayouts = useRef<Map<number, { top: number; bottom: number }> | null>(new Map());

  // Format the reference to only show book and chapter
  const simplifiedReference = scripture.reference.split(':');

  // Split scripture text into an array of words with their indices
  const [words, setWords] = useState<{ text: string; index: number }>();

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
    const matches = preprocessText(scripture.text).match(regex) ||;

    const wordList = matches.map((match, index) => ({
      text: match,
      index
    }));

    setWords(wordList);
  }, [scripture.text]);

  // Calculate and store word layouts
  useEffect(() => {
    const layoutMap = new Map<number, { top: number; bottom: number }>();
    words.forEach(word => {
      const span = document.querySelector(`[data-index="${word.index}"]`);
      if (span) {
        const rect = span.getBoundingClientRect();
        layoutMap.set(word.index, { top: rect.top, bottom: rect.bottom });
      }
    });
    wordLayouts.current = layoutMap;
  }, [words]);

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
  },);

  // Group highlighted words into phrases
  useEffect(() => {
    // Group words by their groupId
    const groups = new Map<number | undefined, HighlightedWord>();

    highlightedWords.forEach(word => {
      const groupId = word.groupId |
| 0; // Use 0 for ungrouped words
      if (!groups.has(groupId)) {
        groups.set(groupId,);
      }
      groups.get(groupId)?.push(word);
    });

    // Sort words within each group by index
    const sortedPhrases: HighlightedPhrase =;

    groups.forEach((words, groupId) => {
      // Sort words in the group by their index to maintain sentence order
      const sortedWords = [...words].sort((a, b) => a.index - b.index);

      // For single words or ungrouped words
      if (groupId === 0 |
| sortedWords.length === 1) {
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
      const aIndex = a.words?.index |
| 0;
      const bIndex = b.words?.index |
| 0;
      return aIndex - bIndex;
    });

    setPhrases(sortedPhrases);
  }, [highlightedWords]);

  // Handle selection start
  const handleSelectionStart = (index: number, e: React.TouchEvent | React.MouseEvent) => {
    // Reset scrolling detection
    isScrollingRef.current = false;
    lastHighlightedIndex.current = index;

    // Record start position and time
    if ('touches' in e) {
      const touch = e.touches;
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    }

    // Start selection
    setIsSelecting(true);
    setSelectionStartIndex(index);
    setSelectedIndices(new Set([index]));
  };

  // Handle touch/mouse movement
  const handleSelectionMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isSelecting |
| selectionStartIndex === null |
| !wordLayouts.current) return;

    let currentWordIndex: number | null = null;

    // For touch events
    if ('touches' in e) {
      const touch = e.touches;
      const currentX = touch.clientX;
      const currentY = touch.clientY;
      const deltaX = Math.abs(currentX - touchStartRef.current.x);
      const deltaY = Math.abs(currentY - touchStartRef.current.y);

      // If movement is mostly vertical and significant, it's likely scrolling
      if (deltaY > deltaX * 2 && deltaY > 15) {
        isScrollingRef.current = true;
        setIsSelecting(false);
        setSelectedIndices(new Set());
        return;
      }

      // If we confirmed it's scrolling, don't process selection
      if (isScrollingRef.current) return;

      // Get the element at touch position
      const element = document.elementFromPoint(currentX, currentY);

      if (element) {
        const wordIndex = element.getAttribute('data-index');
        if (wordIndex !== null) {
          currentWordIndex = parseInt(wordIndex);
        }
      }
    } else {
      // For mouse events, just pass the target element's data-index
      const target = e.target as HTMLElement;
      const wordIndex = target.getAttribute('data-index');

      if (wordIndex !== null) {
        currentWordIndex = parseInt(wordIndex);
      }
    }

    if (currentWordIndex !== null && currentWordIndex !== lastHighlightedIndex.current) {
      lastHighlightedIndex.current = currentWordIndex;
      updateSelectedRange(currentWordIndex);
    }
  };

  // Update the range of selected words
  const updateSelectedRange = (currentIndex: number) => {
    if (selectionStartIndex === null) return;

    const start = Math.min(selectionStartIndex, currentIndex);
    const end = Math.max(selectionStartIndex, currentIndex);
    const newSelectedIndices = new Set<number>();

    for (let i = start; i <= end; i++) {
      const wordAtIndex = words.find(w => w.index === i);
      if (wordAtIndex && wordAtIndex.text.trim() !== '') {
        newSelectedIndices.add(i);
      }
    }
    setSelectedIndices(newSelectedIndices);
  };

  // Handle selection end
  const handleSelectionEnd = () => {
    if (!isSelecting |
| isScrollingRef.current) {
      setIsSelecting(false);
      setSelectedIndices(new Set());
      return;
    }

    const currentGroupId = selectionGroupCounter;

    selectedIndices.forEach(index => {
      const wordObj = words.find(w => w.index === index);
      if (wordObj && !highlightedWords.some(hw => hw.index === index)) {
        highlightWord(wordObj.text, index, currentGroupId);
      }
    });

    if (selectedIndices.size > 0) {
      setSelectionGroupCounter(prev => prev + 1);
    }

    // Reset selection state
    setIsSelecting(false);
    setSelectionStartIndex(null);
    setSelectedIndices(new Set());
    lastHighlightedIndex.current = null;
  };

  // Simple click handler for desktop
  const handleClick = (word: string, index: number) => {
    // Toggle highlight on click
    if (highlightedWords.some(hw => hw.index === index)) {
      removeHighlight(index);
    } else {
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
  },);

  return (
    <ReadingContainer>
      <ScriptureCard>
        <ScriptureReference>
          {simplifiedReference} ({scripture.translation})
        </ScriptureReference>

        <ScriptureText className="scripture-text">
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
                $isHighlighted={isHighlighted |
| isCurrentlySelected}
                onClick={(e) => {
                  // Only handle click for non-touch devices
                  if (window.matchMedia('(hover: hover)').matches) {
                    handleClick(word.text, word.index);
                  }
                }}
                onTouchStart={(e) => handleSelectionStart(word.index, e)}
                onTouchMove={handleSelectionMove}
                onTouchEnd={handleSelectionEnd}
                onTouchCancel={() => {
                  setIsSelecting(false);
                  setSelectedIndices(new Set());
                }}
                data-index={word.index}
              >
                {word.text}
              </WordSpan>
            );
          })}
        </ScriptureText>
      </ScriptureCard>

      <InstructionText>
        {window.matchMedia('(hover: hover)').matches
          ? 'Click on words to highlight them. Scroll down to reflect.'
          : 'Tap to highlight words or press and slide to select multiple words. Scroll down to reflect.'}
      </InstructionText>

      {/* Add some helper text specifically for multi-line selection */}
      <ScrollHintText>
        To select words across lines, start on the first word and drag to the last word of your phrase.
      </ScrollHintText>

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