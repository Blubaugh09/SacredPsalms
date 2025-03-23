'use client';

import styled from 'styled-components';

// Layout Components
export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Card = styled.div`
  background: var(--card-background);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px var(--shadow);
  color: var(--card-foreground);
`;

export const FlexRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Typography
export const PageTitle = styled.h1`
  font-size: 2.4rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--primary);
  font-weight: 700;
`;

export const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: var(--primary);
  margin-bottom: 1rem;
`;

export const ScriptureText = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  line-height: 1.8;
  white-space: pre-line;
  margin: 1rem 0;
  color: var(--card-foreground);
  
  @media (min-width: 768px) {
    font-size: 1.6rem;
  }
`;

export const ScriptureReference = styled.div`
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
  text-align: right;
`;

// Inputs
export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--light-gray);
  border-radius: 8px;
  font-size: 1.1rem;
  background: var(--card-background);
  color: var(--card-foreground);
  min-height: 120px;
  resize: vertical;
  font-family: 'Lato', sans-serif;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

export const Timer = styled.div`
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin: 1rem 0;
  color: var(--primary);
  font-family: 'Lato', sans-serif;
`;

// Buttons
export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'outline' }>`
  padding: 0.8rem 1.4rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${props => {
    switch(props.$variant) {
      case 'secondary':
        return `
          background-color: var(--secondary);
          color: white;
          border: none;
          &:hover {
            background-color: var(--secondary-dark);
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: var(--primary);
          border: 1px solid var(--primary);
          &:hover {
            background-color: var(--primary-light);
            color: white;
          }
        `;
      default:
        return `
          background-color: var(--primary);
          color: white;
          border: none;
          &:hover {
            background-color: var(--primary-light);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--white);
  color: var(--primary);
  border: 1px solid var(--light-gray);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--primary-light);
    color: var(--white);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;

// Navigation
export const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1.5rem;
`;

export const StepDot = styled.div<{ $active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.$active ? 'var(--primary)' : 'var(--light-gray)'};
  transition: background-color 0.3s ease;
`;

// Footer
export const Footer = styled.footer`
  text-align: center;
  padding: 1.5rem;
  color: var(--medium-gray);
  font-size: 0.9rem;
`;

// Animation
export const FadeIn = styled.div`
  animation: fadeIn 0.5s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// Progress
export const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 8px;
  background-color: var(--light-gray);
  border-radius: 4px;
  margin: 1rem 0;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.$progress}%;
    background-color: var(--primary);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

// Settings
export const SettingsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--light-gray);
  
  &:last-child {
    border-bottom: none;
  }
`;

export const SettingsLabel = styled.label`
  font-weight: 500;
  color: var(--foreground);
`;

// Header with optional back button
export const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 1rem;
  position: relative;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  left: 1rem;
  font-size: 1.5rem;
  color: var(--primary);
  cursor: pointer;
  
  &:hover {
    color: var(--primary-light);
  }
`;

export const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: 1.25rem;
  color: var(--primary);
`;

// Modal and overlay
export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 90%;
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  color: var(--card-foreground);
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--medium-gray);
  cursor: pointer;
  
  &:hover {
    color: var(--dark-gray);
  }
`;

// Instructions
export const Instructions = styled.div`
  border-left: 3px solid var(--primary);
  padding-left: 1rem;
  margin: 1rem 0;
  color: var(--card-foreground);
  font-style: italic;
  font-size: 1.1rem;
`;

// Highlighted text
export const HighlightedText = styled.span`
  background-color: var(--accent);
  padding: 2px 0;
`; 