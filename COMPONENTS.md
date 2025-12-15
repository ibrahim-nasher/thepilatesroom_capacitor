# Component Library Documentation

## Overview
Complete UI component library matching native iOS/Android design with #4CAF50 primary color, Montserrat font, and full RTL support.

## Components

### Button
**Location**: `src/components/common/Button/`

**Import**:
```tsx
import { Button } from '@components/common';
```

**Usage**:
```tsx
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>

<Button variant="outline" loading={isLoading}>
  Submit
</Button>

<Button 
  variant="text" 
  icon={<SomeIcon />} 
  iconPosition="left"
  fullWidth
>
  Full Width Button
</Button>
```

**Props**:
- `variant`: 'primary' | 'secondary' | 'outline' | 'text' (default: 'primary')
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `fullWidth`: boolean (default: false)
- `disabled`: boolean (default: false)
- `loading`: boolean (default: false)
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right' (default: 'left')
- `hapticFeedback`: boolean (default: true)

---

### Input
**Location**: `src/components/common/Input/`

**Import**:
```tsx
import { Input } from '@components/common';
```

**Usage**:
```tsx
<Input 
  label="Email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<Input 
  label="Password"
  type="password"
  error={passwordError}
  clearable
  onClear={() => setPassword('')}
/>

<Input 
  prefixIcon={<SearchIcon />}
  placeholder="Search..."
  size="small"
/>
```

**Props**:
- `label`: string
- `error`: string (displays error message)
- `success`: boolean (shows success state)
- `prefixIcon`: ReactNode
- `suffixIcon`: ReactNode
- `clearable`: boolean (shows × button)
- `onClear`: () => void
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- Plus all standard HTML input props

---

### Card
**Location**: `src/components/common/Card/`

**Import**:
```tsx
import { Card } from '@components/common';
```

**Usage**:
```tsx
<Card elevation="medium" padding="large">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

<Card 
  onClick={handleCardClick}
  variant="outlined"
  hapticFeedback
>
  Clickable Card
</Card>
```

**Props**:
- `padding`: 'none' | 'small' | 'medium' | 'large' (default: 'medium')
- `elevation`: 'none' | 'low' | 'medium' | 'high' (default: 'medium')
- `variant`: 'default' | 'outlined' (default: 'default')
- `onClick`: () => void (makes card clickable)
- `hapticFeedback`: boolean (default: true)

---

### Modal
**Location**: `src/components/common/Modal/`

**Import**:
```tsx
import { Modal } from '@components/common';
```

**Usage**:
```tsx
<Modal 
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Modal Title"
  size="medium"
>
  <p>Modal content</p>
</Modal>

<Modal 
  isOpen={isOpen}
  onClose={onClose}
  size="fullscreen"
  closeOnBackdropClick={false}
  closeOnEscape={false}
>
  Custom modal content
</Modal>
```

**Props**:
- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string
- `showCloseButton`: boolean (default: true)
- `closeOnBackdropClick`: boolean (default: true)
- `closeOnEscape`: boolean (default: true)
- `size`: 'small' | 'medium' | 'large' | 'fullscreen' (default: 'medium')

---

### Loading
**Location**: `src/components/common/Loading/`

**Import**:
```tsx
import { Loading } from '@components/common';
```

**Usage**:
```tsx
// Fullscreen loading
<Loading variant="fullscreen" text="Loading..." />

// Inline spinner
<Loading variant="inline" size="small" />

// Skeleton loaders
<Loading variant="skeleton-text" />
<Loading variant="skeleton-card" />
<Loading variant="skeleton-list" rows={5} />
```

**Props**:
- `variant`: 'fullscreen' | 'inline' | 'skeleton-text' | 'skeleton-card' | 'skeleton-list' (default: 'inline')
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `text`: string (optional label)
- `rows`: number (for skeleton-list, default: 3)

---

### Toast
**Location**: `src/components/common/Toast/`

**Import**:
```tsx
import { Toast } from '@components/common';
```

**Usage**:
```tsx
const [toastOpen, setToastOpen] = useState(false);

<Toast
  isOpen={toastOpen}
  onClose={() => setToastOpen(false)}
  message="Operation successful!"
  type="success"
  duration={3000}
/>

<Toast
  isOpen={errorToastOpen}
  onClose={() => setErrorToastOpen(false)}
  message="Something went wrong"
  type="error"
  position="top"
/>
```

**Props**:
- `message`: string (required)
- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `type`: 'success' | 'error' | 'warning' | 'info' (default: 'info')
- `duration`: number in ms, 0 = no auto-dismiss (default: 3000)
- `position`: 'top' | 'bottom' (default: 'bottom')

---

## Design Tokens

All components use consistent design tokens from `src/styles/_variables.scss`:

**Colors**:
- Primary: #4CAF50 (green)
- Secondary: #2196F3 (blue)
- Error: #F44336 (red)
- Warning: #FF9800 (orange)
- Success: #4CAF50 (green)

**Typography**:
- Font Family: Montserrat
- Font Sizes: sm (14px), base (16px), lg (18px), xl (20px)
- Font Weights: normal (400), medium (500), semibold (600), bold (700)

**Spacing** (8px scale):
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

**Border Radius**:
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px

## Features

✅ **TypeScript**: Full type safety with exported interfaces  
✅ **RTL Support**: All components work with Arabic (right-to-left)  
✅ **Responsive**: Mobile-first design with desktop breakpoints  
✅ **Accessibility**: Proper ARIA labels and keyboard navigation  
✅ **Animations**: Smooth transitions and loading states  
✅ **Haptic Feedback**: Native feel with Capacitor Haptics  
✅ **iOS Safe Areas**: Proper handling of notch and home indicator  
✅ **Dark Mode Ready**: Variables structure supports theming  

## Best Practices

1. **Import from index**: Always use `import { Button } from '@components/common'`
2. **Use TypeScript**: Leverage exported interfaces for type safety
3. **Haptic feedback**: Keep enabled for better UX (disable only if needed)
4. **Skeleton loaders**: Use for better perceived performance
5. **Toast notifications**: Prefer over alerts for non-critical messages
6. **Modal sizes**: Use appropriate size for content (avoid fullscreen unless needed)

## Next Steps

Use these components to build:
- Login/Register pages
- Class listing and details
- Package browsing
- Booking flows
- User profile
- Notifications list

All auth pages should be built using these components in Phase 4.
