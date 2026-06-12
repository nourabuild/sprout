# Sprout Design Tokens

Design tokens for Sprout, authored in the Design Tokens Community Group 2025.10 format and built with Style Dictionary.

The npm package name is `@insidiouss/sprout`. The unscoped `sprout` package name is already taken on npm, and `@nourabuild` can be used later after the npm organization exists.

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

Native platform outputs are also included:

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

Run the build:

```bash
npm run build
```

Generated outputs:

- `build/css/variables.css` exports CSS custom properties.
- `build/json/tokens.json` exports nested JSON with units preserved.
- `build/react-native/theme.ts` exports a typed React Native theme object.
- `build/swiftui/SproutTheme.swift` exports a SwiftUI theme enum.
- `build/compose/SproutTheme.kt` exports a Jetpack Compose theme object.

## Npm Package Setup

These repository changes prepare the package for npm publishing:

- `package.json` uses the scoped package name `@insidiouss/sprout`.
- `publishConfig.access` is set to `public`, which is required for public scoped packages.
- `repository`, `homepage`, and `bugs` point to `https://github.com/nourabuild/sprout`.
- `files` limits the published package to `build/`, `tokens/`, `config.js`, `README.md`, and `LICENSE`.
- `exports` exposes CSS, JSON, React Native, SwiftUI, and Compose outputs.
- `prepublishOnly` runs `npm run build && npm run lint` before `npm publish`.

## Publish to Npm

Use the `insidiouss` npm account, which owns the `@insidiouss` scope.

Before publishing, confirm these npm account requirements:

- The logged-in npm account has two-factor authentication enabled for publishing, or it uses a granular npm access token with publish permission and 2FA bypass enabled.

1. Install dependencies.

```bash
npm install
```

2. Log in to npm.

```bash
npm login
npm whoami
npm profile get
```

3. Build and validate the package.

```bash
npm run build
npm run lint
npm pack --dry-run
```

4. Publish the package.

```bash
npm publish --access public
```

5. Confirm the upload.

```bash
npm view @insidiouss/sprout version
npm view @insidiouss/sprout dist.tarball
```

If the npm account scope is different, update `package.json` `name` and the install examples in this README before publishing.
