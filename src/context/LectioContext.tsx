'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LectioSession, LectioStep, Scripture } from '../types';
import { fetchPsalm, getRandomPsalm } from '../lib/api';

// Default ESV Psalm 23 as fallback
const defaultScripture: Scripture = {
  reference: 'Psalm 23:1-6',
  translation: 'ESV',
  text: 'The LORD is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He leads me in paths of righteousness for his name\'s sake. Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me. You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows. Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the LORD forever.'
};

// Default session state
const defaultSession: LectioSession = {
  scripture: defaultScripture,
  currentStep: LectioStep.INTRO,
  timerDuration: 120, // 2 minutes default
  backgroundSound: false
};

interface LectioContextType {
  session: LectioSession;
  setScripture: (scripture: Scripture) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: LectioStep) => void;
  updateTimer: (seconds: number) => void;
  toggleSound: () => void;
  setSelectedText: (text: string) => void;
  setReflections: (text: string) => void;
  setPrayers: (text: string) => void;
  resetSession: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  loadRandomPsalm: () => Promise<void>;
  loadSpecificPsalm: (number: number) => Promise<void>;
  isLoading: boolean;
}

const LectioContext = createContext<LectioContextType | undefined>(undefined);

export const useLectio = () => {
  const context = useContext(LectioContext);
  if (!context) {
    throw new Error('useLectio must be used within a LectioProvider');
  }
  return context;
};

export const LectioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<LectioSession>(defaultSession);
  const [isLoading, setIsLoading] = useState(false);

  // Check if current step is first or last
  const isFirstStep = session.currentStep === LectioStep.INTRO;
  const isLastStep = session.currentStep === LectioStep.CONCLUSION;

  // Define step order
  const stepOrder = [
    LectioStep.INTRO,
    LectioStep.LECTIO,
    LectioStep.MEDITATIO,
    LectioStep.ORATIO,
    LectioStep.CONTEMPLATIO,
    LectioStep.CONCLUSION
  ];

  // Functions to manage session state
  const setScripture = (scripture: Scripture) => {
    setSession(prev => ({ ...prev, scripture }));
  };

  const nextStep = () => {
    const currentIndex = stepOrder.indexOf(session.currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setSession(prev => ({ ...prev, currentStep: stepOrder[currentIndex + 1] }));
    }
  };

  const previousStep = () => {
    const currentIndex = stepOrder.indexOf(session.currentStep);
    if (currentIndex > 0) {
      setSession(prev => ({ ...prev, currentStep: stepOrder[currentIndex - 1] }));
    }
  };

  const goToStep = (step: LectioStep) => {
    setSession(prev => ({ ...prev, currentStep: step }));
  };

  const updateTimer = (seconds: number) => {
    setSession(prev => ({ ...prev, timerDuration: seconds }));
  };

  const toggleSound = () => {
    setSession(prev => ({ ...prev, backgroundSound: !prev.backgroundSound }));
  };

  const setSelectedText = (text: string) => {
    setSession(prev => ({ ...prev, selectedText: text }));
  };

  const setReflections = (text: string) => {
    setSession(prev => ({ ...prev, reflections: text }));
  };

  const setPrayers = (text: string) => {
    setSession(prev => ({ ...prev, prayers: text }));
  };

  const resetSession = async () => {
    // First reset to default but keep sound preference
    const soundPreference = session.backgroundSound;

    setSession({
      ...defaultSession,
      backgroundSound: soundPreference
    });

    // Then load a new random Psalm
    await loadRandomPsalm();
  };

  // Load a random Psalm from ESV API
  const loadRandomPsalm = async () => {
    try {
      setIsLoading(true);
      const psalm = await getRandomPsalm();
      setSession(prev => ({ ...prev, scripture: psalm }));
    } catch (error) {
      console.error('Error loading random Psalm:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load a specific Psalm by number
  const loadSpecificPsalm = async (number: number) => {
    try {
      setIsLoading(true);
      const psalm = await fetchPsalm(number);
      setSession(prev => ({ ...prev, scripture: psalm }));
    } catch (error) {
      console.error(`Error loading Psalm ${number}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load from localStorage if available, otherwise load a random Psalm
  useEffect(() => {
    const loadInitialSession = async () => {
      if (typeof window !== 'undefined') {
        const savedSession = localStorage.getItem('lectioSession');
        if (savedSession) {
          try {
            const parsedSession = JSON.parse(savedSession);
            setSession(parsedSession);
          } catch (error) {
            console.error('Failed to parse saved session:', error);
            // If parsing fails, load a random Psalm
            await loadRandomPsalm();
          }
        } else {
          // If no saved session, load a random Psalm
          await loadRandomPsalm();
        }
      }
    };

    loadInitialSession();
  }, []);

  // Save to localStorage when session changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lectioSession', JSON.stringify(session));
    }
  }, [session]);

  return (
    <LectioContext.Provider value={{
      session,
      setScripture,
      nextStep,
      previousStep,
      goToStep,
      updateTimer,
      toggleSound,
      setSelectedText,
      setReflections,
      setPrayers,
      resetSession,
      isLastStep,
      isFirstStep,
      loadRandomPsalm,
      loadSpecificPsalm,
      isLoading
    }}>
      {children}
    </LectioContext.Provider>
  );
}; 