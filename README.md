# Sprout Design Tokens

Design tokens for Sprout, authored in the Design Tokens Community Group 2025.10 format and built with Style Dictionary.

## Install

```bash
npm install @insidiouss/sprout
```

## Usage

Import CSS custom properties:

```js
import "@insidiouss/sprout/css/variables.css";
```

Import generated JSON tokens:

```js
import tokens from "@insidiouss/sprout/tokens.json" with { type: "json" };
```

Import the React Native theme:

```ts
import { theme } from "@insidiouss/sprout/react-native";
```

Native platform outputs are included in the package:

```text
@insidiouss/sprout/swiftui
@insidiouss/sprout/compose
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
- `build/react-native/theme.ts` exports a typed React Native theme object.
- `build/swiftui/SproutTheme.swift` exports a SwiftUI theme enum.
- `build/compose/SproutTheme.kt` exports a Jetpack Compose theme object.

## Development

Build generated outputs:

```bash
npm run build
```

Check formatting:

```bash
npm run lint
```
