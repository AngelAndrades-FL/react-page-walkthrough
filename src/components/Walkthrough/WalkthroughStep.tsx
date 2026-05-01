import { useEffect, useRef, ReactNode } from 'react';
import { useWalkthrough } from './WalkthroughContext';

interface WalkthroughStepProps {
  name: string;
  order: number;
  title?: string;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
  className?: string;
  onEnter?: () => void;
}

export const WalkthroughStep = ({
  name,
  order,
  title,
  content,
  position = 'top',
  children,
  className = 'contents',
  onEnter,
}: WalkthroughStepProps) => {
  const { registerStep, unregisterStep, setTargetElement } = useWalkthrough();
  const elementRef = useRef<HTMLDivElement>(null);
  const onEnterRef = useRef(onEnter);

  // Keep ref in sync so the Provider always has the latest callback
  // without needing it as a registerStep dependency.
  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    registerStep({
      name,
      order,
      title,
      content,
      position,
      // Wrap in a stable ref-based function so re-renders of App don't
      // cause registerStep to be called on every render.
      onEnter: () => onEnterRef.current?.(),
    });

    return () => {
      unregisterStep(name);
    };
  }, [name, order, title, content, position, registerStep, unregisterStep]);

  useEffect(() => {
    if (elementRef.current) {
      setTargetElement(name, elementRef.current);
    }
  }, [name, setTargetElement]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};
