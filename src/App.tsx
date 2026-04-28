import { WalkthroughProvider, WalkthroughStep, useWalkthrough } from './components/Walkthrough';
import { Button, Box, Typography, Stack, Paper } from '@mui/material';

const StartButton = () => {
  const { start } = useWalkthrough();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={start}
      sx={{ px: 3, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem', boxShadow: 3 }}
    >
      Start Walkthrough
    </Button>
  );
};

function App() {
  return (
    <WalkthroughProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Stack spacing={8} sx={{ alignItems: 'center', width: '100%' }}>
          
          <WalkthroughStep 
            name="step1" 
            order={1}
            title="Welcome!" 
            content="This is the new React Page Walkthrough!"
            position="bottom"
          >
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mb: '20px' }}>
              <Typography variant="h4" color="text.primary" sx={{ fontWeight: 'bold' }}>
                React Page Walkthrough
              </Typography>
            </Paper>
          </WalkthroughStep>

          <Stack direction="row" spacing={4} sx={{ justifyContent: 'space-between', width: '100%', maxWidth: '900px' }}>
            <WalkthroughStep 
              name="step2" 
              order={2}
              content="You can highlight any element on the screen."
              position="right"
            >
              <Paper elevation={1} sx={{ bgcolor: 'info.light', p: 3, borderRadius: 2, border: 1, borderColor: 'info.main' }}>
                <Typography variant="h5" color="info.dark" sx={{ fontWeight: 600 }}>Feature 1</Typography>
                <Typography color="info.dark" sx={{ mt: 1 }}>This is a great feature.</Typography>
              </Paper>
            </WalkthroughStep>

            <WalkthroughStep 
              name="step3" 
              order={3}
              content="And here is another one!"
              position="left"
            >
              <Paper elevation={1} sx={{ bgcolor: 'success.light', p: 3, borderRadius: 2, border: 1, borderColor: 'success.main' }}>
                <Typography variant="h5" color="success.dark" sx={{ fontWeight: 600 }}>Feature 2</Typography>
                <Typography color="success.dark" sx={{ mt: 1 }}>Another awesome feature.</Typography>
              </Paper>
            </WalkthroughStep>
          </Stack>

          <WalkthroughStep 
            name="step4" 
            order={4}
            title="Ready?"
            content="Click the button to start the walkthrough again!"
            position="top"
          >
            <StartButton />
          </WalkthroughStep>

        </Stack>
      </Box>
    </WalkthroughProvider>
  );
}

export default App;
