# React Page Walkthrough

A lightweight, accessible page walkthrough component for React built with **Material UI**, **Framer Motion**, and a hand-drawn aesthetic inspired by the original [`jquery-pagewalkthrough`](https://github.com/jwarby/jquery-pagewalkthrough) library.

![Stack](https://img.shields.io/badge/React-19-blue) ![MUI](https://img.shields.io/badge/MUI-v9-purple) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-v12-pink) ![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)

---

## Features

- 🎯 **Highlight any element** on the page with an animated SVG overlay cutout
- 🗂️ **Ordered steps** — declare steps anywhere in the tree; they sort by `order` automatically
- 📬 **`onEnter` callbacks** — fire arbitrary side effects (e.g. open a dialog) when a step becomes active
- 🖋️ **Hand-drawn UI** — GochiHand font, sketch-style arrows and borders
- ♿ **Accessible** — tooltip rendered as an `aria-modal` dialog, keyboard navigation (←/→/Escape)
- 💅 **MUI-native** — all layout uses MUI components; easy to theme

---

## Project Structure

```
src/
└── components/
    └── Walkthrough/
        ├── index.ts                 # Public exports
        ├── WalkthroughContext.tsx   # Context + useWalkthrough hook
        ├── WalkthroughProvider.tsx  # State management, step registry
        ├── WalkthroughStep.tsx      # Per-element wrapper component
        ├── WalkthroughOverlay.tsx   # SVG mask overlay + keyboard handling
        └── WalkthroughTooltip.tsx   # Animated tooltip with nav buttons
public/
└── images/
    ├── arrow-top.png
    ├── arrow-bottom.png
    ├── arrow-left.png
    ├── arrow-right.png
    ├── close.png
    ├── drag.png
    └── scratch-border.png
└── font/
    └── GochiHand-Regular.ttf
```

---

## Prerequisites

Your target project must have the following dependencies installed:

```bash
npm install @mui/material @emotion/react @emotion/styled framer-motion
```

The GochiHand font and hand-drawn image assets in `public/images/` and `public/font/` are also required for the full visual style.

---

## Installation into Another Project

### 1. Copy the component folder

Copy the entire `src/components/Walkthrough/` directory into your project:

```
your-project/
└── src/
    └── components/
        └── Walkthrough/   ← paste here
```

### 2. Copy the public assets

Copy the contents of `public/images/` and `public/font/` into your project's `public/` directory so the hand-drawn arrows, border, and font are served correctly.

### 3. Load the font

Add the following to your global CSS (e.g. `index.css`):

```css
@font-face {
  font-family: 'GochiHand';
  src: url('/font/GochiHand-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
```

---

## Basic Usage

### 1. Wrap your app in `WalkthroughProvider`

```tsx
import { WalkthroughProvider } from './components/Walkthrough';

function App() {
  return (
    <WalkthroughProvider>
      <YourAppContent />
    </WalkthroughProvider>
  );
}
```

> **Note:** Any component that calls `useWalkthrough()` must be rendered **inside** `WalkthroughProvider`. If you need to access walkthrough state within the same component that renders the Provider, extract an inner component (see [Advanced: accessing state inside the same tree](#advanced-accessing-state-inside-the-same-tree)).

### 2. Wrap elements with `WalkthroughStep`

```tsx
import { WalkthroughStep } from './components/Walkthrough';

<WalkthroughStep
  name="welcome"
  order={1}
  title="Welcome!"
  content="This is the first step of the walkthrough."
  position="bottom"
>
  <YourComponent />
</WalkthroughStep>
```

Steps are **sorted by `order`**, not by DOM position, so you can declare them anywhere in the component tree.

### 3. Add a start trigger

```tsx
import { useWalkthrough } from './components/Walkthrough';

const StartButton = () => {
  const { start } = useWalkthrough();
  return <button onClick={start}>Start Tour</button>;
};
```

---

## `WalkthroughStep` Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `name` | `string` | ✅ | — | Unique identifier for this step |
| `order` | `number` | ✅ | — | Display order (lower = earlier) |
| `content` | `ReactNode` | ✅ | — | Body text or JSX shown in the tooltip |
| `title` | `string` | ❌ | — | Optional large heading above the content |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | ❌ | `'top'` | Which side of the element the tooltip appears on |
| `onEnter` | `() => void` | ❌ | — | Callback fired when this step becomes active |
| `children` | `ReactNode` | ✅ | — | The element to highlight |
| `className` | `string` | ❌ | `'contents'` | CSS class on the wrapper `<div>` |

---

## `useWalkthrough` Hook

Returns the full walkthrough context. Available anywhere inside `WalkthroughProvider`.

```ts
const {
  isActive,           // boolean — walkthrough is currently running
  currentStepIndex,   // number  — 0-based index of the current step
  steps,              // StepInfo[] — registered & sorted steps
  start,              // () => void — begin the walkthrough from step 1
  close,              // () => void — end the walkthrough
  next,               // () => void — advance to the next step
  prev,               // () => void — go back to the previous step
  isFirstStep,        // boolean
  isLastStep,         // boolean
} = useWalkthrough();
```

---

## `onEnter` Callback

Use `onEnter` to trigger side effects the moment the walkthrough advances **to** a particular step — for example, opening a modal so the form fields inside it can be highlighted.

```tsx
const [dialogOpen, setDialogOpen] = useState(false);

// Step highlights the Name field inside a dialog.
// onEnter opens the dialog first so the field is visible & measurable.
<WalkthroughStep
  name="name-field"
  order={3}
  title="Your Name"
  content="Enter your full name here."
  position="right"
  onEnter={() => setDialogOpen(true)}
>
  <TextField label="Name" />
</WalkthroughStep>
```

> **Tip:** If your `onEnter` target step lives inside a MUI `<Dialog>`, add `keepMounted` to the Dialog so all steps inside it are registered in the walkthrough context even when the dialog is closed. Without this, the walkthrough will treat the step before the dialog as the last step.
>
> ```tsx
> <Dialog open={open} onClose={onClose} keepMounted>
>   ...
> </Dialog>
> ```

---

## Advanced: Accessing State Inside the Same Tree

Because `useWalkthrough()` must be called inside the Provider, if you need to react to walkthrough state in the same component that renders `<WalkthroughProvider>`, split into an inner component:

```tsx
// Inner component — has access to useWalkthrough()
function AppContent() {
  const { isActive } = useWalkthrough();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Auto-close dialog when walkthrough ends
  useEffect(() => {
    if (!isActive) setDialogOpen(false);
  }, [isActive]);

  return <> {/* your page */} </>;
}

// Outer shell — just provides context
function App() {
  return (
    <WalkthroughProvider>
      <AppContent />
    </WalkthroughProvider>
  );
}
```

---

## Keyboard Navigation

While the walkthrough is active:

| Key | Action |
|-----|--------|
| `→` | Next step |
| `←` | Previous step |
| `Escape` | Close walkthrough |

---

## Development

```bash
npm install
npm run dev      # Start dev server at http://localhost:5173
npm run build    # TypeScript check + production build
npm run lint     # ESLint
```
