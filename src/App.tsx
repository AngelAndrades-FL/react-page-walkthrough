import { useState, useCallback, useEffect } from 'react';
import { WalkthroughProvider, WalkthroughStep, useWalkthrough } from './components/Walkthrough';
import {
  Button, Box, Typography, Stack, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField,
} from '@mui/material';

// ─── Start Walkthrough Button ───────────────────────────────────────────────

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

// ─── User Info Dialog ────────────────────────────────────────────────────────

interface UserInfoDialogProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const UserInfoDialog = ({ open, onClose, onOpen }: UserInfoDialogProps) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', { name, age });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth keepMounted>
      <DialogTitle>Tell Us About You</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {/* Step 6 — Name field */}
            <WalkthroughStep
              name="step6"
              order={6}
              title="Your Name"
              content="Enter your full name here."
              position="right"
              onEnter={onOpen}
            >
              <TextField
                id="user-name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                autoFocus
              />
            </WalkthroughStep>

            {/* Step 7 — Age field */}
            <WalkthroughStep
              name="step7"
              order={7}
              title="Your Age"
              content="Enter your age. We promise we won't tell anyone!"
              position="right"
            >
              <TextField
                id="user-age"
                label="Age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                fullWidth
              />
            </WalkthroughStep>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained">Submit</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// ─── App ─────────────────────────────────────────────────────────────────────

// Inner component so it can call useWalkthrough() inside the Provider.
function AppContent() {
  const { isActive } = useWalkthrough();
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = useCallback(() => setDialogOpen(true), []);
  const closeDialog = useCallback(() => setDialogOpen(false), []);

  // Close the dialog whenever the walkthrough ends (Finish or Escape).
  useEffect(() => {
    if (!isActive) setDialogOpen(false);
  }, [isActive]);

  return (
    <>
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Stack spacing={8} sx={{ alignItems: 'center', width: '100%' }}>

          {/* Step 1 — Hero title */}
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

          {/* Steps 2 & 3 — Feature cards */}
          <Stack direction="row" spacing={4} sx={{ justifyContent: 'space-between', width: '100%', maxWidth: '900px' }}>
            <WalkthroughStep
              name="step2"
              order={2}
              content="You can highlight any element on the screen."
              position="right"
            >
              <Paper elevation={1} sx={{ bgcolor: 'info.light', p: 3, borderRadius: 2, border: 1, borderColor: 'info.main', width: '250px' }}>
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
              <Paper elevation={1} sx={{ bgcolor: 'success.light', p: 3, borderRadius: 2, border: 1, borderColor: 'success.main', height: "100px" }}>
                <Typography variant="h5" color="success.dark" sx={{ fontWeight: 600 }}>Feature 2</Typography>
                <Typography color="success.dark" sx={{ mt: 1 }}>Another awesome feature.</Typography>
              </Paper>
            </WalkthroughStep>
          </Stack>

          {/* Steps 4 & 5 — Action buttons */}
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
            <WalkthroughStep
              name="step4"
              order={4}
              title="Ready?"
              content="Click the button to start the walkthrough again!"
              position="top"
            >
              <StartButton />
            </WalkthroughStep>

            {/* Step 5 — Enter Your Info button */}
            <WalkthroughStep
              name="step5"
              order={5}
              title="Enter Your Info"
              content="Click this button to fill in your name and age. The walkthrough will guide you through the form!"
              position="top"
            >
              <Button
                id="user-info-btn"
                variant="outlined"
                color="secondary"
                onClick={openDialog}
                sx={{ px: 3, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
              >
                Enter Your Info
              </Button>
            </WalkthroughStep>
          </Stack>

        </Stack>
      </Box>

      {/* Dialog lives outside the main Stack so its portal doesn't affect layout.
          Steps 6 & 7 are registered inside UserInfoDialog and are only in the
          DOM when the dialog is open. */}
      <UserInfoDialog open={dialogOpen} onClose={closeDialog} onOpen={openDialog} />
    </>
  );
}

function App() {
  return (
    <WalkthroughProvider>
      <AppContent />
    </WalkthroughProvider>
  );
}

export default App;

