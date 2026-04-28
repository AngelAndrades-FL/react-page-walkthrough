import { createContext, useContext, ReactNode } from 'react';

export interface StepInfo {
  name: string;
  content: ReactNode;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  targetElement?: HTMLElement | null;
  order: number;
}

export interface WalkthroughContextType {
  isActive: boolean;
  currentStepIndex: number;
  steps: StepInfo[];
  registerStep: (step: StepInfo) => void;
  unregisterStep: (name: string) => void;
  setTargetElement: (name: string, element: HTMLElement | null) => void;
  start: () => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export const WalkthroughContext = createContext<WalkthroughContextType | null>(null);

export const useWalkthrough = () => {
  const context = useContext(WalkthroughContext);
  if (!context) {
    throw new Error('useWalkthrough must be used within a WalkthroughProvider');
  }
  return context;
};
