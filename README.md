# Sprout Design Tokens

<img src="https://github.com/user-attachments/assets/26046d66-aa86-4949-ae17-661e511fa7a5" style="display:block;margin:auto;width:100%;height:auto;">


Design tokens for the Noura design system, built with Style Dictionary and OKLCH colors.

## Setup

```bash
npm install
make build
```

## Usage

### CSS
```css
@import './light/build/css/light.css';

.button {
  background: var(--ds-color-noura-500);
  padding: var(--ds-dimension-space-3);
}
```

### JavaScript
```js
import tokens from './light/build/json/tokens.json';
```

## Commands

```bash
make build     # Build tokens
make validate  # Check token structure  
make analyze   # Token statistics
make demo      # Open demo page
```

## Structure

- `light/tier-1-definitions/` - Base tokens (colors, spacing, etc.)
- `light/tier-2-usage/` - Semantic tokens (backgrounds, content)
- `light/tier-3-components/` - Component tokens (buttons, forms)
- `light/build/` - Generated CSS, JS, JSON files

## Colors

Uses OKLCH color space for better accessibility and perceptual uniformity.

- **Noura brand colors**: 50-950 scale
- **Neutral grays**: 100-900 scale  
- **Utility colors**: Blue, green, yellow, red

## Spacing

4px grid system: `space-1` (4px) to `space-12` (48px)
