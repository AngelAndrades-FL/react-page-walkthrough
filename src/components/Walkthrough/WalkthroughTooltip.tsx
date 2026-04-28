import { useWalkthrough, StepInfo } from './WalkthroughContext';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

interface WalkthroughTooltipProps {
  step: StepInfo;
  rect: DOMRect;
}

export const WalkthroughTooltip = ({ step, rect }: WalkthroughTooltipProps) => {
  const { next, prev, close, isFirstStep, isLastStep } = useWalkthrough();
  
  const gap = 40; 

  const getPositionStyles = () => {
    switch (step.position) {
      case 'top':
        return { top: rect.top - gap, left: rect.left + rect.width / 2, x: '-50%', y: '-100%' };
      case 'bottom':
        return { top: rect.bottom + gap, left: rect.left + rect.width / 2, x: '-50%', y: '0%' };
      case 'left':
        return { top: rect.top + rect.height / 2, left: rect.left - gap, y: '-50%', x: '-100%' };
      case 'right':
        return { top: rect.top + rect.height / 2, left: rect.right + gap, y: '-50%', x: '0%' };
      default:
        return { top: rect.bottom + gap, left: rect.left + rect.width / 2, x: '-50%', y: '0%' };
    }
  };

  const renderArrow = () => {
    switch (step.position) {
      case 'top':
        return <Box sx={{ position: 'absolute', bottom: '-86px', left: '130px', width: '75px', height: '86px', backgroundImage: "url('/images/arrow-bottom.png')", backgroundRepeat: 'no-repeat', zIndex: 10 }} />;
      case 'bottom':
        return <Box sx={{ position: 'absolute', top: '-86px', left: '130px', width: '75px', height: '86px', backgroundImage: "url('/images/arrow-top.png')", backgroundRepeat: 'no-repeat', zIndex: 10 }} />;
      case 'left':
        return <Box sx={{ position: 'absolute', top: '35px', right: '-105px', width: '105px', height: '56px', backgroundImage: "url('/images/arrow-right.png')", backgroundRepeat: 'no-repeat', zIndex: 10 }} />;
      case 'right':
        return <Box sx={{ position: 'absolute', top: '35px', left: '-105px', width: '105px', height: '56px', backgroundImage: "url('/images/arrow-left.png')", backgroundRepeat: 'no-repeat', zIndex: 10 }} />;
      default:
        return null;
    }
  };

  return (
    <>
      <button 
        onClick={close}
        className="walkthrough-close-btn"
      >
        <Box sx={{ position: 'absolute', top: '-45px', left: '36px', width: '44px', height: '40px', backgroundImage: "url('/images/close.png')", backgroundRepeat: 'no-repeat' }} />
        Click here to close
      </button>

      <motion.div
        initial={false}
        animate={getPositionStyles() as any}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        style={{ position: 'absolute', width: '320px', pointerEvents: 'auto', zIndex: 100000 }}
      >
        <Box sx={{ position: 'relative', p: '10px', overflow: 'visible' }}>
          <Box sx={{ position: 'absolute', top: '-35px', right: '-30px', width: '44px', height: '40px', backgroundImage: "url('/images/drag.png')", backgroundRepeat: 'no-repeat', zIndex: 10000 }} />
          
          {renderArrow()}

          <Box sx={{ fontFamily: "'GochiHand', cursive", color: 'white', textAlign: 'center', fontSize: '22px' }}>
            {step.title && <Box sx={{ fontSize: '40px', mb: 1 }}>{step.title}</Box>}
            {step.content}
          </Box>

          <Box sx={{ backgroundImage: "url('/images/scratch-border.png')", backgroundRepeat: 'no-repeat', backgroundPosition: 'left top', width: '358px', height: '42px', mt: 2, ml: '-19px', clear: 'both', position: 'relative' }}>
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pt: '10px', px: 4, fontFamily: "'GochiHand', cursive", fontSize: '24px', color: '#00c7ff' }}>
              {!isFirstStep ? (
                <button onClick={prev} className="walkthrough-nav-btn">&larr; Previous</button>
              ) : <div />}
              
              {!isLastStep ? (
                <button onClick={next} className="walkthrough-nav-btn">Next &rarr;</button>
              ) : (
                <button onClick={close} className="walkthrough-nav-btn">Finish &#10004;</button>
              )}
            </Box>
          </Box>
        </Box>
      </motion.div>
    </>
  );
};
