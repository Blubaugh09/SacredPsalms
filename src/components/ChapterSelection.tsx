'use client';

import React, { useState, useEffect } from 'react';
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

// Add these new styled components for the dropdown
const CategoryDropdown = styled.div`
  position: relative;
  width: 100%;
  max-width: 250px;
  margin-bottom: 1.5rem;
  z-index: 10;
`;

const DropdownButton = styled.button`
  width: 100%;
  background-color: var(--card-background);
  color: var(--primary);
  border: 1px solid var(--accent);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover, &:focus {
    background-color: var(--accent);
    color: #000000;
  }
  
  &::after {
    content: '▼';
    font-size: 0.7rem;
    margin-left: 8px;
  }
`;

const DropdownContent = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: absolute;
  background-color: var(--card-background);
  width: 100%;
  border: 1px solid var(--accent);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 20;
  margin-top: 4px;
`;

const DropdownItem = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  background-color: ${props => props.$active ? 'var(--accent)' : 'transparent'};
  color: ${props => props.$active ? '#000000' : 'var(--primary)'};
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: var(--accent);
    color: #000000;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const CategoryDescription = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: var(--medium-gray);
  font-style: italic;
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
    id: 'all',
    name: 'All Psalms',
    description: "Browse all 150 Psalms",
    psalms: []
  },
  {
    id: 'praise',
    name: 'Praise to God',
    description: "Celebrating God's character and works",
    psalms: [8, 19, 33, 100, 103, 145, 146, 147, 148, 149, 150]
  },
  {
    id: 'lament',
    name: 'Crying Out to God',
    description: 'Expressing sorrow or crying out to God',
    psalms: [3, 22, 42, 44, 88]
  },
  {
    id: 'penitential',
    name: 'Confess and Seek Forgiveness',
    description: 'Confessing sin and seeking forgiveness',
    psalms: [6, 32, 38, 51, 102, 130, 143]
  },
  {
    id: 'wisdom',
    name: 'Wisdom Psalms',
    description: 'Teaching about godly living',
    psalms: [1, 37, 49, 73, 112, 119, 128]
  },
  {
    id: 'messianic',
    name: 'Messianic Psalms',
    description: 'Focusing on the king or Messiah',
    psalms: [2, 18, 20, 21, 45, 72, 89, 110, 132]
  },
  {
    id: 'trust',
    name: 'Psalms of Trust',
    description: "Expressing confidence in God's care",
    psalms: [11, 16, 23, 27, 62, 63, 91, 121]
  },
  {
    id: 'healing',
    name: 'Psalms for Healing',
    description: "Seeking God's restoration and comfort",
    psalms: [30, 41, 107, 116, 147]
  },
  {
    id: 'guidance',
    name: 'Psalms for Guidance',
    description: "Seeking God's direction in life",
    psalms: [25, 43, 86, 119]
  }
];

const ChapterSelection: React.FC = () => {
  const { loadPsalm, loadRandomPsalm, isLoading } = useMeditation();
  const [readChapters, setReadChapters] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const psalmNumbers = Array.from({ length: 150 }, (_, i) => i + 1);
  
  useEffect(() => {
    try {
      const storedChapters = localStorage.getItem('readPsalms');
      if (storedChapters) {
        setReadChapters(JSON.parse(storedChapters));
      }
    } catch (error) {
      console.error('Error loading read psalms from localStorage:', error);
    }
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && 
          !(event.target as Element).closest('.category-dropdown')) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);
  
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
    if (selectedCategory !== 'all') {
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
    setSelectedCategory(categoryId);
    setDropdownOpen(false);
  };
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  // Get the selected category
  const selectedCategoryInfo = psalmCategories.find(c => c.id === selectedCategory);
  
  // Filter psalms based on selected category
  const filteredPsalms = selectedCategory === 'all'
    ? psalmNumbers
    : selectedCategoryInfo?.psalms || [];
  
  return (
    <ChapterContainer>
      <TranslationSelector />
      <Title>Sacred Psalms</Title>
      <Subtitle>
        Select a Psalm chapter to begin your meditation
      </Subtitle>
      
      {/* Category dropdown */}
      <CategoryDropdown className="category-dropdown">
        <DropdownButton onClick={toggleDropdown}>
          {selectedCategoryInfo?.name || 'Select a category'}
        </DropdownButton>
        <DropdownContent $isOpen={dropdownOpen}>
          {psalmCategories.map(category => (
            <DropdownItem
              key={category.id}
              $active={selectedCategory === category.id}
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.name}
            </DropdownItem>
          ))}
        </DropdownContent>
      </CategoryDropdown>
      
      {selectedCategory !== 'all' && selectedCategoryInfo && (
        <CategoryDescription>
          {selectedCategoryInfo.description}
        </CategoryDescription>
      )}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ChapterGrid>
            {psalmNumbers.map(num => {
              const isInCategory = selectedCategory === 'all' 
                ? true 
                : filteredPsalms.includes(num);
              
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
          
          <RandomButton onClick={handleRandomClick}>
            {selectedCategory !== 'all' 
              ? `Random ${selectedCategoryInfo?.name.replace('Psalms of ', '').replace('Psalms for ', '').replace(' Psalms', '')} Psalm` 
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