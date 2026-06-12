# Sprout Design Tokens

Design tokens for Sprout, built with Style Dictionary and authored against the Design Tokens Community Group 2025.10 format.

```bash
npm run build
```

## Source

- `tokens/core.json` is the source of truth.
- Color tokens are grouped by `colors.light` and `colors.dark`.
- Color token values use `colorSpace`, `components`, `alpha`, and `hex`.
- Dimension tokens use `{ "value": number, "unit": "px" }`.
- Motion duration tokens use `{ "value": number, "unit": "ms" }`.
- Z-index, spring, and opacity tokens are unitless numbers.

## Outputs

- `build/css/variables.css` exports CSS custom properties.
- `build/json/tokens.json` exports nested JSON with units preserved.
- `build/react-native/theme.ts` exports a typed React Native theme object with dimensions and durations converted to numbers.
- `build/swiftui/SproutTheme.swift` exports a SwiftUI theme enum.
- `build/compose/SproutTheme.kt` exports a Jetpack Compose theme object.
