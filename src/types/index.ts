export enum MeditationStep {
  CHAPTER_SELECT = 'chapter_select',
  BREATHING = 'breathing',
  READING = 'reading',
  REFLECTION = 'reflection'
}

export interface Scripture {
  reference: string;
  text: string;
  translation: string;
}

export interface HighlightedWord {
  word: string;
  index: number;
}

export interface MeditationSession {
  scripture: Scripture;
  currentStep: MeditationStep;
  highlightedWords: HighlightedWord[];
  breathCompleted: boolean;
  breathCount: number;
}

// Keep the old types for backward compatibility during transition
export enum LectioStep {
  INTRO = 'intro',
  LECTIO = 'lectio',
  MEDITATIO = 'meditatio',
  ORATIO = 'oratio',
  CONTEMPLATIO = 'contemplatio',
  CONCLUSION = 'conclusion'
}

export interface LectioSession {
  scripture: Scripture;
  currentStep: LectioStep;
  selectedText?: string;
  reflections?: string;
  prayers?: string;
  timerDuration: number; // in seconds
  backgroundSound?: boolean;
} 