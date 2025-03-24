'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { MeditationSession, MeditationStep, Scripture, HighlightedWord, TranslationType } from '../types';
import { fetchPsalm, getRandomPsalm } from '../lib/api';

// Default ESV Psalm as fallback
const defaultScripture: Scripture = {
  reference: 'Psalm 23:1-6',
  translation: 'ESV',
  text: 'The LORD is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He leads me in paths of righteousness for his name\'s sake. Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me. You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows. Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the LORD forever.'
};

// Default session state
const defaultSession: MeditationSession = {
  scripture: defaultScripture,
  currentStep: MeditationStep.CHAPTER_SELECT,
  highlightedWords: [],
  breathCompleted: false,
  breathCount: 0
};

// Add groupId to the HighlightedWord interface
export interface HighlightedWord {
  word: string;
  index: number;
  groupId?: number;
}

interface MeditationContextType {
  session: MeditationSession;
  isLoading: boolean;
  loadPsalm: (psalmNumber: number) => Promise<void>;
  loadRandomPsalm: () => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
  highlightWord: (word: string, index: number, groupId?: number) => void;
  removeHighlight: (index: number) => void;
  resetHighlights: () => void;
  markBreathComplete: () => void;
  incrementBreath: () => void;
  resetSession: () => void;
  translation: TranslationType;
  setTranslation: (translation: TranslationType) => void;
}

const MeditationContext = createContext<MeditationContextType | undefined>(undefined);

export const useMeditation = () => {
  const context = useContext(MeditationContext);
  if (!context) {
    throw new Error('useMeditation must be used within a MeditationProvider');
  }
  return context;
};

export const MeditationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<MeditationSession>(defaultSession);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [translation, setTranslation] = useState<TranslationType>('ESV');

  // Load from local storage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem('meditationSession');
    if (savedSession) {
      try {
        // Always ensure we start at chapter selection when the app loads
        const parsedSession = JSON.parse(savedSession);
        parsedSession.currentStep = MeditationStep.CHAPTER_SELECT;
        setSession(parsedSession);
      } catch (error) {
        console.error('Failed to parse saved session', error);
      }
    }
  }, []);

  // Save to local storage when session changes
  useEffect(() => {
    localStorage.setItem('meditationSession', JSON.stringify(session));
  }, [session]);

  // Reset the session to default state (chapter selection)
  const resetSession = useCallback(() => {
    setSession({
      ...defaultSession,
      // Keep the current scripture but reset everything else
      scripture: session.scripture
    });
  }, [session]);

  // Move to the next step in the meditation flow
  const nextStep = useCallback(() => {
    const { currentStep } = session;
    let nextStep: MeditationStep;

    switch (currentStep) {
      case MeditationStep.CHAPTER_SELECT:
        nextStep = MeditationStep.BREATHING;
        break;
      case MeditationStep.BREATHING:
        nextStep = MeditationStep.READING;
        break;
      case MeditationStep.READING:
        nextStep = MeditationStep.REFLECTION;
        break;
      case MeditationStep.REFLECTION:
        // Stay on reflection when at the end
        nextStep = MeditationStep.REFLECTION;
        break;
      default:
        nextStep = MeditationStep.CHAPTER_SELECT;
    }

    setSession(prev => ({ ...prev, currentStep: nextStep }));
  }, [session]);

  // Move to the previous step in the meditation flow
  const prevStep = useCallback(() => {
    const { currentStep } = session;
    let prevStep: MeditationStep;

    switch (currentStep) {
      case MeditationStep.REFLECTION:
        prevStep = MeditationStep.READING;
        break;
      case MeditationStep.READING:
        prevStep = MeditationStep.BREATHING;
        break;
      case MeditationStep.BREATHING:
        prevStep = MeditationStep.CHAPTER_SELECT;
        break;
      case MeditationStep.CHAPTER_SELECT:
        // Stay on chapter select when at the beginning
        prevStep = MeditationStep.CHAPTER_SELECT;
        break;
      default:
        prevStep = MeditationStep.CHAPTER_SELECT;
    }

    setSession(prev => ({ ...prev, currentStep: prevStep }));
  }, [session]);

  // Load a specific psalm
  const loadPsalm = useCallback(async (psalmNumber: number) => {
    setIsLoading(true);
    try {
      const psalm = await fetchPsalm(psalmNumber, translation);
      setSession(prev => ({
        ...prev,
        scripture: psalm,
        currentStep: MeditationStep.BREATHING,
        highlightedWords: [],
        breathCompleted: false,
        breathCount: 0
      }));
    } catch (error) {
      console.error('Failed to load psalm', error);
    } finally {
      setIsLoading(false);
    }
  }, [translation]);

  // Load a random psalm
  const loadRandomPsalm = useCallback(async () => {
    setIsLoading(true);
    try {
      const psalm = await getRandomPsalm(translation);
      setSession(prev => ({
        ...prev,
        scripture: psalm,
        currentStep: MeditationStep.BREATHING,
        highlightedWords: [],
        breathCompleted: false,
        breathCount: 0
      }));
    } catch (error) {
      console.error('Failed to load random psalm', error);
    } finally {
      setIsLoading(false);
    }
  }, [translation]);

  // Highlight a word in the scripture
  const highlightWord = useCallback((word: string, index: number, groupId?: number) => {
    setSession(prev => ({
      ...prev,
      highlightedWords: [
        ...prev.highlightedWords,
        { word, index, groupId }
      ]
    }));
  }, []);

  // Remove a highlight
  const removeHighlight = useCallback((index: number) => {
    setSession(prev => ({
      ...prev,
      highlightedWords: prev.highlightedWords.filter(hw => hw.index !== index)
    }));
  }, []);

  // Reset all highlights
  const resetHighlights = useCallback(() => {
    setSession(prev => ({
      ...prev,
      highlightedWords: []
    }));
  }, []);

  // Mark breathing exercise as complete
  const markBreathComplete = useCallback(() => {
    setSession(prev => ({
      ...prev,
      breathCompleted: true
    }));
  }, []);

  // Increment breath count
  const incrementBreath = useCallback(() => {
    setSession(prev => ({
      ...prev,
      breathCount: prev.breathCount + 1
    }));
  }, []);

  // Update localStorage when translation changes
  const handleTranslationChange = useCallback((newTranslation: TranslationType) => {
    setTranslation(newTranslation);
    try {
      localStorage.setItem('preferredTranslation', newTranslation);
    } catch (error) {
      console.error('Error saving translation preference:', error);
    }
  }, []);

  return (
    <MeditationContext.Provider
      value={{
        session,
        isLoading,
        loadPsalm,
        loadRandomPsalm,
        nextStep,
        prevStep,
        highlightWord,
        removeHighlight,
        resetHighlights,
        markBreathComplete,
        incrementBreath,
        resetSession,
        translation,
        setTranslation: handleTranslationChange
      }}
    >
      {children}
    </MeditationContext.Provider>
  );
}; 