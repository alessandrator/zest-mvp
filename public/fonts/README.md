# Font Documentation for ZEST Homepage

## Required Font: Gaiza Stencil

The homepage requires the "Gaiza Stencil" font for the main "zest" text.

### Current Implementation
- Using Orbitron font as a fallback with stencil-like styling
- Font weight: 900 (extra bold)
- Letter spacing: 0.1em for stencil effect

### To implement the exact "Gaiza Stencil" font:
1. Locate the "Gaiza Stencil" font file (.woff2, .woff, .ttf)
2. Place the font file in `/public/fonts/`
3. Update the CSS font-face declaration in globals.css
4. Verify the font loads correctly

### Current CSS Implementation
```css
.font-gaiza-stencil {
  font-family: 'Orbitron', monospace;
  font-weight: 900;
  letter-spacing: 0.1em;
}
```

### Future Font Implementation (when Gaiza Stencil is available)
```css
@font-face {
  font-family: 'Gaiza Stencil';
  src: url('/fonts/gaiza-stencil.woff2') format('woff2'),
       url('/fonts/gaiza-stencil.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.font-gaiza-stencil {
  font-family: 'Gaiza Stencil', 'Orbitron', monospace;
  font-weight: normal;
}
```