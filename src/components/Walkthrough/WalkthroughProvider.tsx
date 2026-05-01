import { useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import { WalkthroughContext, StepInfo } from './WalkthroughContext';
import { WalkthroughOverlay } from './WalkthroughOverlay';

export const WalkthroughProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<StepInfo[]>([]);

  const sortedSteps = useMemo(() => {
    return [...steps].sort((a, b) => a.order - b.order);
  }, [steps]);

  const registerStep = useCallback((step: StepInfo) => {
    setSteps((prev) => {
      if (prev.some((s) => s.name === step.name)) {
        return prev.map((s) => (s.name === step.name ? { ...s, ...step } : s));
      }
      return [...prev, step];
    });
  }, []);

  const unregisterStep = useCallback((name: string) => {
    setSteps((prev) => prev.filter((s) => s.name !== name));
  }, []);

  const setTargetElement = useCallback((name: string, element: HTMLElement | null) => {
    setSteps((prev) => prev.map((s) => (s.name === name ? { ...s, targetElement: element } : s)));
  }, []);

  const start = useCallback(() => {
    setIsActive(true);
    setCurrentStepIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsActive(false);
  }, []);

  const next = useCallback(() => {
    if (currentStepIndex < sortedSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      close();
    }
  }, [currentStepIndex, sortedSteps.length, close]);

  const prev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  // Fire onEnter for the incoming step after each index commit.
  useEffect(() => {
    if (!isActive) return;
    const step = sortedSteps[currentStepIndex];
    step?.onEnter?.();
    // sortedSteps is intentionally omitted from deps — we only want this
    // to fire when the index actually changes, not on every re-registration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, currentStepIndex]);

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === sortedSteps.length - 1;

  const contextValue = useMemo(() => ({
    isActive,
    currentStepIndex,
    steps: sortedSteps,
    registerStep,
    unregisterStep,
    setTargetElement,
    start,
    close,
    next,
    prev,
    isFirstStep,
    isLastStep,
  }), [
    isActive,
    currentStepIndex,
    sortedSteps,
    registerStep,
    unregisterStep,
    setTargetElement,
    start,
    close,
    next,
    prev,
    isFirstStep,
    isLastStep,
  ]);

  return (
    <WalkthroughContext.Provider value={contextValue}>
      {children}
      {isActive && sortedSteps.length > 0 && <WalkthroughOverlay />}
    </WalkthroughContext.Provider>
  );
};
