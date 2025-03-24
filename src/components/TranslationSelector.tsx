import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMeditation } from '../context/MeditationContext';
import { TranslationType } from '../lib/api';

const SelectorContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
`;

const TranslationToggle = styled.div`
  display: flex;
  background-color: var(--card-background);
  border-radius: 20px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--accent);
`;

const TranslationOption = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'var(--accent)' : 'transparent'};
  color: ${props => props.$active ? '#000000' : 'var(--primary)'};
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.85rem;
  font-weight: ${props => props.$active ? '700' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.$active ? 'var(--accent)' : 'rgba(var(--accent-rgb), 0.2)'};
  }
  
  &:focus {
    outline: none;
  }
`;

const TranslationSelector: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { translation, setTranslation } = useMeditation();
  
  useEffect(() => {
    setIsMounted(true);
    
    try {
      const savedTranslation = localStorage.getItem('preferredTranslation');
      if (savedTranslation === 'ESV' || savedTranslation === 'KJV') {
        setTranslation(savedTranslation);
      }
    } catch (error) {
      console.error('Error loading translation preference:', error);
    }
  }, [setTranslation]);
  
  const handleTranslationChange = (newTranslation: TranslationType) => {
    setTranslation(newTranslation);
    
    try {
      localStorage.setItem('preferredTranslation', newTranslation);
    } catch (error) {
      console.error('Error saving translation preference:', error);
    }
  };
  
  if (!isMounted) {
    return (
      <SelectorContainer>
        <TranslationToggle>
          <TranslationOption 
            $active={false} 
            onClick={() => {}}
            aria-label="English Standard Version"
          >
            ESV
          </TranslationOption>
          <TranslationOption 
            $active={false} 
            onClick={() => {}}
            aria-label="King James Version"
          >
            KJV
          </TranslationOption>
        </TranslationToggle>
      </SelectorContainer>
    );
  }
  
  return (
    <SelectorContainer>
      <TranslationToggle>
        <TranslationOption 
          $active={translation === 'ESV'} 
          onClick={() => handleTranslationChange('ESV')}
          aria-label="English Standard Version"
        >
          ESV
        </TranslationOption>
        <TranslationOption 
          $active={translation === 'KJV'} 
          onClick={() => handleTranslationChange('KJV')}
          aria-label="King James Version"
        >
          KJV
        </TranslationOption>
      </TranslationToggle>
    </SelectorContainer>
  );
};

export default TranslationSelector;