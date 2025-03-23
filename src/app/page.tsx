'use client';

import { useEffect } from 'react';
import { MeditationProvider, useMeditation } from '../context/MeditationContext';
import { MeditationStep } from '../types';
import ChapterSelection from '../components/ChapterSelection';
import BreathingExercise from '../components/BreathingExercise';
import ScriptureReading from '../components/ScriptureReading';
import styled from 'styled-components';

const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const AppContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid var(--background);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 1rem;
  color: var(--medium-gray);
  font-size: 0.9rem;
  margin-top: auto;
`;

const MeditationContent = () => {
  const { session, isLoading } = useMeditation();
  
  useEffect(() => {
    // Reset scroll position on step change
    window.scrollTo(0, 0);
  }, [session.currentStep]);
  
  return (
    <PageContainer>
      <AppContainer>
        {isLoading && (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        )}
        
        {session.currentStep === MeditationStep.CHAPTER_SELECT && <ChapterSelection />}
        {session.currentStep === MeditationStep.BREATHING && <BreathingExercise />}
        {session.currentStep === MeditationStep.READING && <ScriptureReading />}
      </AppContainer>
      
      <Footer>
   
      </Footer>
    </PageContainer>
  );
};

export default function Home() {
  return (
    <MeditationProvider>
      <MeditationContent />
    </MeditationProvider>
  );
}
