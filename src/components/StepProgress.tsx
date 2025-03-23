import React from 'react';
import { LectioStep } from '../types';
import styled from 'styled-components';
import { StepDot } from './StyledComponents';

interface StepProgressProps {
  currentStep: LectioStep;
}

// Create the styled components needed for the progress steps
const ProgressContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 1.5rem 0;
`;

const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const StepLabel = styled.span`
  font-size: 0.8rem;
  color: var(--medium-gray);
`;

const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  return (
    <ProgressContainer>
      <ProgressStep>
        <StepDot $active={currentStep >= LectioStep.INTRO} />
        <StepLabel>Intro</StepLabel>
      </ProgressStep>
      <ProgressStep>
        <StepDot $active={currentStep >= LectioStep.LECTIO} />
        <StepLabel>Lectio</StepLabel>
      </ProgressStep>
      <ProgressStep>
        <StepDot $active={currentStep >= LectioStep.MEDITATIO} />
        <StepLabel>Meditatio</StepLabel>
      </ProgressStep>
      <ProgressStep>
        <StepDot $active={currentStep >= LectioStep.ORATIO} />
        <StepLabel>Oratio</StepLabel>
      </ProgressStep>
      <ProgressStep>
        <StepDot $active={currentStep >= LectioStep.CONTEMPLATIO} />
        <StepLabel>Contemplatio</StepLabel>
      </ProgressStep>
    </ProgressContainer>
  );
};

export default StepProgress; 