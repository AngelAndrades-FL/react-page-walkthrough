import { useEffect, useState } from 'react';
import { useWalkthrough } from './WalkthroughContext';
import { WalkthroughTooltip } from './WalkthroughTooltip';
import { motion, AnimatePresence } from 'framer-motion';

export const WalkthroughOverlay = () => {
  const { steps, currentStepIndex } = useWalkthrough();
  const currentStep = steps[currentStepIndex];
  
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      if (currentStep?.targetElement) {
        const el = currentStep.targetElement;
        let measureEl = el;
        if (el.children.length > 0 && getComputedStyle(el).display === 'contents') {
          measureEl = el.children[0] as HTMLElement;
        }
        setRect(measureEl.getBoundingClientRect());
      } else {
        setRect(null);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [currentStep]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, pointerEvents: 'none' }}
      >
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'auto' }}>
          <defs>
            <mask id="hole-mask">
              <rect width="100%" height="100%" fill="white" />
              {rect && (
                <motion.rect
                  fill="black"
                  initial={false}
                  animate={{
                    x: rect.x - 10,
                    y: rect.y - 10,
                    width: rect.width + 20,
                    height: rect.height + 20,
                  }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                  rx={8}
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.6)"
            mask="url(#hole-mask)"
          />
        </svg>

        {rect && currentStep && (
          <WalkthroughTooltip step={currentStep} rect={rect} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
