'use client';

import React, { useState } from 'react';
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

const ResetButton = styled.button`
  background: none;
  border: none;
  color: var(--medium-gray);
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary);
    text-decoration: underline;
  }
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

// Updated CategoryContainer with better mobile support
const CategoryContainer = styled.div`
  width: 100%;
  max-width: 850px;
  margin-bottom: 1.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 30px;
    background: linear-gradient(to right, transparent, var(--background));
    pointer-events: none;
    opacity: 0.8;
  }
`;

const CategoryScrollArea = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 8px 4px;
  margin: 0 -4px;
  
  /* Hide scrollbar but allow scrolling */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryList = styled.div`
  display: flex;
  gap: 8px;
  padding-bottom: 4px; /* Space for scroll bounce */
  width: max-content; /* Allow horizontal expansion */
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  background-color: ${props => props.$active ? 'var(--accent)' : 'transparent'};
  color: ${props => props.$active ? '#000000' : 'var(--primary)'};
  border: 1px solid var(--accent);
  border-radius: 20px;
  padding: 10px 16px; /* Larger touch target */
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px; /* Ensure minimum tap target size */
  
  &:hover {
    background-color: var(--accent);
    color: #000000;
  }
  
  &:first-child {
    margin-left: 4px; /* Add padding at start */
  }
  
  &:last-child {
    margin-right: 20px; /* Add padding at end to account for fade gradient */
  }
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
`;

const HighlightedGrid = styled.div`
  position: relative;
  width: 100%;
`;

const CategoryInfo = styled.div`
  text-align: center;
  margin: 1rem 0;
  font-size: 0.9rem; /* Slightly larger for mobile readability */
  color: var(--medium-gray);
  font-style: italic;
  padding: 0 12px;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: var(--primary);
  font-size: 0.85rem;
  padding: 8px 12px; /* Larger touch target */
  cursor: pointer;
  margin-top: 10px; /* More space for touch */
  text-decoration: underline;
  display: inline-block;
  
  &:hover {
    color: var(--accent);
  }
`;

// Define Psalm categories
interface PsalmCategory {
  id: string;
  name: string;
  description: string;
  psalms: number[];
}

const psalmCategories: PsalmCategory[] = [
  {
    id: 'praise',
    name: 'Praise',
    description: "Celebrating God's character and works",
    psalms: [8, 19, 33, 100, 103, 145, 146, 147, 148, 149, 150]
  },
  {
    id: 'lament',
    name: 'Lament',
    description: 'Expressing sorrow or crying out to God',
    psalms: [3, 22, 42, 44, 88]
  },
  {
    id: 'penitential',
    name: 'Penitential',
    description: 'Confessing sin and seeking forgiveness',
    psalms: [6, 32, 38, 51, 102, 130, 143]
  },
  {
    id: 'wisdom',
    name: 'Wisdom',
    description: 'Teaching about godly living',
    psalms: [1, 37, 49, 73, 112, 119, 128]
  },
  {
    id: 'messianic',
    name: 'Messianic',
    description: 'Focusing on the king or Messiah',
    psalms: [2, 18, 20, 21, 45, 72, 89, 110, 132]
  },
  {
    id: 'trust',
    name: 'Trust',
    description: "Expressing confidence in God's care",
    psalms: [11, 16, 23, 27, 62, 63, 91, 121]
  },
  {
    id: 'healing',
    name: 'Healing',
    description: "Seeking God's restoration and comfort",
    psalms: [30, 41, 107, 116, 147]
  },
  {
    id: 'guidance',
    name: 'Guidance',
    description: "Seeking God's direction in life",
    psalms: [25, 43, 86, 119]
  }
];

const ChapterSelection: React.FC = () => {
  const { loadPsalm, loadRandomPsalm, isLoading } = useMeditation();
  const [readChapters, setReadChapters] = React.useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
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
    // If a category is selected, pick a random psalm from that category
    if (selectedCategory) {
      const category = psalmCategories.find(c => c.id === selectedCategory);
      if (category && category.psalms.length > 0) {
        const randomIndex = Math.floor(Math.random() * category.psalms.length);
        const randomPsalm = category.psalms[randomIndex];
        loadPsalm(randomPsalm);
        return;
      }
    }
    // Otherwise, use the default random psalm function
    loadRandomPsalm();
  };
  
  const handleResetHistory = () => {
    if (window.confirm('Are you sure you want to reset your reading history? This cannot be undone.')) {
      try {
        localStorage.removeItem('readPsalms');
        setReadChapters([]);
      } catch (error) {
        console.error('Error resetting reading history:', error);
      }
    }
  };
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(prevCategory => 
      prevCategory === categoryId ? null : categoryId
    );
  };
  
  // Filter psalms based on selected category
  const filteredPsalms = selectedCategory
    ? psalmCategories.find(c => c.id === selectedCategory)?.psalms || []
    : psalmNumbers;
  
  // Get the selected category information
  const selectedCategoryInfo = selectedCategory
    ? psalmCategories.find(c => c.id === selectedCategory)
    : null;
  
  // Add a ref for the scroll container
  const categoryScrollRef = React.useRef<HTMLDivElement>(null);
  
  // Add a function to scroll to the selected category
  const scrollToSelectedCategory = React.useCallback(() => {
    if (categoryScrollRef.current && selectedCategory) {
      const container = categoryScrollRef.current;
      const selectedButton = container.querySelector(`[data-category="${selectedCategory}"]`);
      
      if (selectedButton) {
        // Calculate position to center the button
        const containerWidth = container.offsetWidth;
        const buttonLeft = (selectedButton as HTMLElement).offsetLeft;
        const buttonWidth = (selectedButton as HTMLElement).offsetWidth;
        
        container.scrollTo({
          left: buttonLeft - containerWidth / 2 + buttonWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedCategory]);
  
  // Call the scroll function when category changes
  React.useEffect(() => {
    scrollToSelectedCategory();
  }, [selectedCategory, scrollToSelectedCategory]);
  
  return (
    <ChapterContainer>
      <TranslationSelector />
      <Title>Sacred Psalms</Title>
      <Subtitle>
        Select a Psalm chapter to begin your meditation
      </Subtitle>
      
      {/* Updated category selection */}
      <CategoryContainer>
        <CategoryScrollArea ref={categoryScrollRef}>
          <CategoryList>
            {psalmCategories.map(category => (
              <CategoryButton
                key={category.id}
                $active={selectedCategory === category.id}
                onClick={() => handleCategorySelect(category.id)}
                data-category={category.id}
              >
                {category.name}
              </CategoryButton>
            ))}
          </CategoryList>
        </CategoryScrollArea>
      </CategoryContainer>
      
      {selectedCategoryInfo && (
        <CategoryInfo>
          {selectedCategoryInfo.description}
          <br />
          <ClearButton onClick={() => setSelectedCategory(null)}>
            Show all Psalms
          </ClearButton>
        </CategoryInfo>
      )}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <HighlightedGrid>
            <ChapterGrid>
              {psalmNumbers.map(num => {
                const isInCategory = selectedCategory 
                  ? filteredPsalms.includes(num)
                  : true;
                
                return (
                  <ChapterNumber 
                    key={num} 
                    onClick={() => handlePsalmClick(num)}
                    aria-label={`Psalm ${num}`}
                    style={{ 
                      opacity: isInCategory ? 1 : 0.3,
                      pointerEvents: isInCategory ? 'auto' : 'none'
                    }}
                  >
                    {num}
                    {readChapters.includes(num) && <ReadIndicator />}
                  </ChapterNumber>
                );
              })}
            </ChapterGrid>
          </HighlightedGrid>
          
          <RandomButton onClick={handleRandomClick}>
            {selectedCategory 
              ? `Select a random ${selectedCategoryInfo?.name} Psalm` 
              : 'Select a random Psalm'}
          </RandomButton>
          
          {readChapters.length > 0 && (
            <ResetButton onClick={handleResetHistory}>
              Reset reading history
            </ResetButton>
          )}
        </>
      )}
    </ChapterContainer>
  );
};

export default ChapterSelection;