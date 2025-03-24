'use client';

import React from 'react';
import { useMeditation } from '../context/MeditationContext';
import styled from 'styled-components';
import TranslationSelector from './TranslationSelector';

const ChapterContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.7rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--medium-gray);
  margin-bottom: 1.5rem;
  text-align: center;
  max-width: 85%;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`;

const ChapterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 850px;
  justify-content: center;
  margin-bottom: 1rem;
  
  @media (min-width: 400px) {
    grid-template-columns: repeat(6, 1fr);
  }
  
  @media (min-width: 500px) {
    grid-template-columns: repeat(8, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(10, 1fr);
    gap: 10px;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(15, 1fr);
    gap: 12px;
  }
`;

const ReadIndicator = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--accent);
  transform: translate(25%, -25%);
`;

const ChapterNumber = styled.button`
  position: relative;
  background-color: var(--card-background);
  color: var(--primary);
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid var(--accent);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem !important;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  &:hover {
    background-color: var(--accent);
    color: var(--foreground);
    transform: scale(1.05);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--primary-light);
  }
  
  @media (min-width: 400px) {
    font-size: 1.2rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
`;

const RandomButton = styled.button`
  background: none;
  border: none;
  color: var(--primary);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.8rem 1.5rem;
  border-radius: 20px;
  margin-top: 0.5rem;
  font-style: italic;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent);
    color: var(--foreground);
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
    margin-top: 1rem;
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid var(--light-gray);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ChapterSelection: React.FC = () => {
  const { loadPsalm, loadRandomPsalm, isLoading } = useMeditation();
  const [readChapters, setReadChapters] = React.useState<number[]>([]);
  
  const psalmNumbers = Array.from({ length: 150 }, (_, i) => i + 1);
  
  React.useEffect(() => {
    try {
      const storedChapters = localStorage.getItem('readPsalms');
      if (storedChapters) {
        setReadChapters(JSON.parse(storedChapters));
      }
    } catch (error) {
      console.error('Error loading read psalms from localStorage:', error);
    }
  }, []);
  
  const handlePsalmClick = (psalmNumber: number) => {
    if (!readChapters.includes(psalmNumber)) {
      const updatedReadChapters = [...readChapters, psalmNumber];
      setReadChapters(updatedReadChapters);
      
      try {
        localStorage.setItem('readPsalms', JSON.stringify(updatedReadChapters));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    
    loadPsalm(psalmNumber);
  };
  
  const handleRandomClick = () => {
    loadRandomPsalm();
  };
  
  return (
    <ChapterContainer>
      <TranslationSelector />
      <Title>Sacred Psalms</Title>
      <Subtitle>
        Select a Psalm chapter to begin your meditation
      </Subtitle>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ChapterGrid>
            {psalmNumbers.map(num => (
              <ChapterNumber 
                key={num} 
                onClick={() => handlePsalmClick(num)}
                aria-label={`Psalm ${num}`}
              >
                {num}
                {readChapters.includes(num) && <ReadIndicator />}
              </ChapterNumber>
            ))}
          </ChapterGrid>
          
          <RandomButton onClick={handleRandomClick}>
            Select a random Psalm
          </RandomButton>
        </>
      )}
    </ChapterContainer>
  );
};

export default ChapterSelection;