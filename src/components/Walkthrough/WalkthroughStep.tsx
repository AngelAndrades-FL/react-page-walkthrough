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
}

export const WalkthroughStep = ({
  name,
  order,
  title,
  content,
  position = 'top',
  children,
  className = 'contents'
}: WalkthroughStepProps) => {
  const { registerStep, unregisterStep, setTargetElement } = useWalkthrough();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerStep({
      name,
      order,
      title,
      content,
      position,
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
