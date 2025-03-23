'use client';

import React from 'react';
import { useLectio } from '../context/LectioContext';
import { LectioStep } from '../types';
import { 
  StepIndicator, 
  StepDot, 
  ButtonGroup, 
  Button,
  Instructions
} from './StyledComponents';

const StepNavigation: React.FC = () => {
  const { session, nextStep, previousStep, isFirstStep, isLastStep } = useLectio();
  const { currentStep } = session;
  
  // Create an array of step names in order
  const steps = [
    LectioStep.INTRO,
    LectioStep.LECTIO,
    LectioStep.MEDITATIO,
    LectioStep.ORATIO,
    LectioStep.CONTEMPLATIO,
    LectioStep.CONCLUSION
  ];

  // Get current step instructions
  const getStepInstructions = (): string => {
    switch (currentStep) {
      case LectioStep.INTRO:
        return "Welcome to Lectio Divina. This guided practice will lead you through a sacred reading of scripture. Begin when you're ready.";
      case LectioStep.LECTIO:
        return "READ: Slowly read the scripture passage. Allow the words to sink in deeply. Read it several times if needed.";
      case LectioStep.MEDITATIO:
        return "MEDITATE: Select a word or phrase that stands out to you by highlighting it with your finger or cursor. Then reflect on its meaning.";
      case LectioStep.ORATIO:
        return "PRAY: Respond to the text in prayer. What is God inviting you to through this passage? Write your prayer response below.";
      case LectioStep.CONTEMPLATIO:
        return "CONTEMPLATE: Rest in God's presence. Use the timer to help you maintain silence and be present with what you've received.";
      case LectioStep.CONCLUSION:
        return "You've completed your Lectio Divina practice. Take what you've received into your day. You can start a new session or review your reflections.";
      default:
        return "";
    }
  };

  // Get button text
  const getNextButtonText = (): string => {
    if (isLastStep) return "Start New Session";
    return "Next Step";
  };

  return (
    <>
      <StepIndicator>
        {steps.map((step) => (
          <StepDot key={step} active={currentStep === step} />
        ))}
      </StepIndicator>
      
      <Instructions>{getStepInstructions()}</Instructions>
      
      <ButtonGroup>
        <Button 
          variant="outline" 
          onClick={previousStep}
          disabled={isFirstStep}
        >
          Previous
        </Button>
        
        <Button onClick={nextStep}>
          {getNextButtonText()}
        </Button>
      </ButtonGroup>
    </>
  );
};

export default StepNavigation; 