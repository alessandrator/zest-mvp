# ZEST MVP Hero Section

## Overview
This document describes the implementation of the homepage hero section for the ZEST MVP, designed to match the reference image4 specifications exactly.

## Reference Image
**Reference Image4**: The hero section layout and styling are based on the visual specifications provided in image4, which shows:
- Left side: Large "ZEST" logo in bold black typography
- Right side: Hand-drawn yellow lemon outline with orbiting text elements
- Background: Light gray (#d8d8d8)

## Implementation Details

### Components
- **Location**: `/components/hero/hero-section.tsx`
- **Usage**: Imported and used in `/app/page.tsx` as the main homepage content

### Design Specifications

#### Layout
- **Background Color**: `#d8d8d8` (light gray as specified in image4)
- **Layout**: Two-column grid (responsive)
- **Height**: Full viewport height (`min-h-screen`)

#### ZEST Logo (Left Side)
- **Font**: Arial Black, Helvetica Neue, Arial, sans-serif
- **Weight**: 900 (font-black)
- **Size**: Responsive clamp(4rem, 15vw, 14rem)
- **Color**: Black
- **Letter Spacing**: 0.02em
- **Line Height**: 0.85

#### Lemon Illustration (Right Side)
- **Shape**: Hand-drawn organic lemon outline (SVG path)
- **Color**: `#FFFF66` (yellow as specified)
- **Stroke Width**: 3px
- **Style**: Rounded line caps and joins for hand-drawn effect
- **Size**: 96x96 (w-96 h-96)

#### Orbiting Text
- **Words**: "BEST BRANDS", "SUSTAINABLE DREAMERS", "CREATORS", "HERITAGE HOLDERS", "SCHOOLS", "TALENTS"
- **Font**: Arial, sans-serif
- **Weight**: Bold
- **Color**: White
- **Size**: 14px
- **Style**: All caps, positioned along the lemon's perimeter
- **Animation**: 20-second smooth rotation around the lemon path
- **Separators**: Bullet points (•) between text segments

### Animation
The orbiting text rotates smoothly around the lemon outline with:
- **Duration**: 20 seconds per full rotation
- **Easing**: Linear
- **Direction**: Clockwise
- **Transform Origin**: Center of the lemon (200px, 200px)

### Responsive Design
- **Mobile**: Single column layout with centered elements
- **Desktop**: Two-column grid with ZEST logo on left, lemon on right
- **Typography**: Responsive font sizing using CSS clamp()
- **Spacing**: Adaptive padding and margins

### Technical Implementation
- **Framework**: React with Next.js 14
- **Styling**: Tailwind CSS with custom inline styles
- **Animation**: CSS keyframes within SVG
- **Client-side**: Uses "use client" directive for browser-only features

## File Structure
```
components/
  hero/
    hero-section.tsx    # Main hero component
app/
  page.tsx             # Homepage using hero section
```

## Dependencies
- React (client component)
- Tailwind CSS for utility classes
- Custom CSS animations for text rotation

## Browser Compatibility
- Modern browsers supporting CSS animations
- SVG text-on-path support
- CSS Grid layout support

## Maintenance Notes
- Reference image4 should be consulted for any visual modifications
- Animation duration can be adjusted in the CSS keyframes
- Text content can be modified in the textPath elements
- Colors and typography match the ZEST brand guidelines
- No navigation, buttons, or additional UI elements per requirements