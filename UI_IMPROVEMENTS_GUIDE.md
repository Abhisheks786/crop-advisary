# 🌿 Smart Crop Advisory — UI/UX Design System Guide

> Comprehensive design specifications, color scales, button hierarchy, and responsive patterns for SmartCrop AI.

---

## 🎨 1. Olive-Greenish Color Palette

Our color palette is inspired by natural agricultural landscapes, fertile soils, and lush vegetation.

### 🌿 Primary Brand Scales (Olive, Sage & Leaf)

| Token Name | Hex Code | Purpose & Application |
|---|---|---|
| `olive-900` | `#262619` | High-contrast headings, main copy |
| `olive-800` | `#363622` | Dark card titles, hover active text |
| `olive-700` | `#4A4A2E` | **Primary CTA buttons**, active brand accents |
| `olive-600` | `#6B6B47` | Secondary labels, subheadings |
| `olive-200` | `#E6E4D7` | Form borders, card dividers |
| `olive-100` | `#F5F4EE` | Section backgrounds, input fills |
| `olive-50` | `#FAFAF7` | Page canvas background |
| `sage-600` | `#5C7A3C` | **Secondary buttons**, positive factors |
| `leaf-500` | `#5FA83D` | **Accent buttons**, score rings, badges |
| `forest-600` | `#3A6E38` | Deep crop indicators, hover highlights |
| `clay-600` | `#936B53` | Soil characteristics, organic matter |

### 🚨 Semantic Status Colors

- **Success (`#48A348`)**: Optimal soil match, high compatibility score (≥ 70%).
- **Warning (`#E6A900`)**: Moderate suitability (50–69%), water deficit warnings.
- **Error (`#DC2626`)**: Incompatible crop rotation, extreme pH, destructive actions.
- **Info (`#0284C7`)**: Hydrological data, irrigation scheduling.

---

## 🔘 2. Enhanced Button System (`Button.jsx`)

Our `<Button>` component provides 6 semantic variants and 5 standardized sizes with minimum touch targets (≥ 44px on mobile).

### Available Variants

```jsx
// 1. Primary: Olive-700 (#4A4A2E) - Form submits, main CTAs
<Button variant="primary" size="lg">Continue</Button>

// 2. Secondary: Sage-600 (#5C7A3C) - Secondary actions
<Button variant="secondary" size="md">Save Draft</Button>

// 3. Accent: Leaf-500 (#5FA83D) - High priority highlights
<Button variant="accent" size="lg">Generate Advisory</Button>

// 4. Outline: Clean white with olive border
<Button variant="outline" size="md">Back</Button>

// 5. Ghost: Transparent background for tertiary tools
<Button variant="ghost" size="sm">Help & Guidance</Button>

// 6. Danger: Deep red for destructive actions
<Button variant="danger" size="md">Deactivate Crop</Button>
```

### Button Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'accent' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Padding, font size & min-height |
| `icon` | Lucide Icon Component | `undefined` | Icon to render |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Placement of icon |
| `loading` | `boolean` | `false` | Shows animated spinner |
| `fullWidth` | `boolean` | `false` | Stretches to 100% width |
| `disabled` | `boolean` | `false` | Disables interaction |

---

## 🎯 3. ButtonGroup Component (`ButtonGroup.jsx`)

Solves mobile button overlapping by enforcing responsive stacking, uniform gaps, and touch accessibility.

### Responsive Form Navigation Example

```jsx
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

<ButtonGroup align="between" spacing="md" responsive>
  <Button variant="outline" icon={ArrowLeft} onClick={handlePrev}>
    Previous Step
  </Button>
  
  <Button variant="accent" icon={Sparkles} iconPosition="right" onClick={handleSubmit}>
    Generate Advisory
  </Button>
</ButtonGroup>
```

---

## 📱 4. Mobile & Touch Accessibility Standards

- **Touch Target**: Minimum height of 44px on all interactive elements.
- **Form Controls**: Generous padding (`px-4 py-3`), clear focus rings (`focus:ring-2 focus:ring-[#5FA83D]`).
- **Contrast**: Text elements conform to WCAG AA+ contrast ratio against backgrounds.
