import prettier from "prettier";
import StyleDictionary from "style-dictionary";

const UNIT_TYPES = new Set(["dimension", "duration"]);

function getTokenValue(token) {
  return token.$value ?? token.value;
}

function getTokenType(token, inheritedType) {
  return token.$type ?? token.type ?? inheritedType;
}

function isUnitValue(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof value.value === "number" &&
    typeof value.unit === "string"
  );
}

function isColorValue(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof value.colorSpace === "string" &&
    Array.isArray(value.components)
  );
}

function unitValueToString(value) {
  return `${value.value}${value.unit}`;
}

function colorValueToString(value) {
  if (typeof value.hex === "string") {
    return value.hex;
  }

  const alpha = typeof value.alpha === "number" ? ` / ${value.alpha}` : "";
  return `color(${value.colorSpace} ${value.components.join(" ")}${alpha})`;
}

function toCssValue(token, inheritedType) {
  const type = getTokenType(token, inheritedType);
  const value = getTokenValue(token);

  if (type === "color" && isColorValue(value)) {
    return colorValueToString(value);
  }

  if (UNIT_TYPES.has(type) && isUnitValue(value)) {
    return unitValueToString(value);
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function toReactNativeValue(token, inheritedType) {
  const type = getTokenType(token, inheritedType);
  const value = getTokenValue(token);

  if (type === "color" && isColorValue(value)) {
    return colorValueToString(value);
  }

  if (UNIT_TYPES.has(type) && isUnitValue(value)) {
    return value.value;
  }

  return value;
}

function toJsonValue(token, inheritedType) {
  const type = getTokenType(token, inheritedType);
  const value = getTokenValue(token);

  if (type === "color" && isColorValue(value)) {
    return colorValueToString(value);
  }

  if (UNIT_TYPES.has(type) && isUnitValue(value)) {
    return unitValueToString(value);
  }

  return value;
}

function toPlainTheme(node, inheritedType, valueFormatter) {
  if (node === null || typeof node !== "object" || Array.isArray(node)) {
    return node;
  }

  const type = getTokenType(node, inheritedType);
  const hasTokenValue =
    Object.prototype.hasOwnProperty.call(node, "$value") ||
    Object.prototype.hasOwnProperty.call(node, "value");

  if (hasTokenValue) {
    return valueFormatter({ ...node, $type: type }, inheritedType);
  }

  return Object.entries(node).reduce((theme, [key, value]) => {
    if (!key.startsWith("$") && key !== "type") {
      theme[key] = toPlainTheme(value, type, valueFormatter);
    }

    return theme;
  }, {});
}

function toIdentifier(value) {
  return value.replace(/[^a-zA-Z0-9_]/g, "_");
}

function toSwiftIdentifier(value) {
  const identifier = toIdentifier(value);
  return /^[0-9]/.test(identifier) ? `_${identifier}` : identifier;
}

function toKotlinIdentifier(value) {
  const identifier = toIdentifier(value);
  return /^[0-9]/.test(identifier) ? `_${identifier}` : identifier;
}

function toNativeGroupName(value) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

function toSwiftColor(value) {
  const [red, green, blue] = value.components;
  const alpha = value.alpha ?? 1;

  return `Color(red: ${red}, green: ${green}, blue: ${blue}, opacity: ${alpha})`;
}

function toKotlinColor(value) {
  return `Color(0xFF${value.hex.replace("#", "")})`;
}

function swiftTokenValue(token, inheritedType) {
  const type = getTokenType(token, inheritedType);
  const value = getTokenValue(token);

  if (type === "color" && isColorValue(value)) {
    return toSwiftColor(value);
  }

  if (UNIT_TYPES.has(type) && isUnitValue(value)) {
    return String(value.value);
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  return String(value);
}

function swiftTokenDeclaration(key, token, inheritedType) {
  const type = getTokenType(token, inheritedType);
  const value = getTokenValue(token);
  const name = toSwiftIdentifier(key);
  const expression = swiftTokenValue(token, inheritedType);

  if (type === "color" && isColorValue(value)) {
    return `static let ${name}: Color = ${expression}`;
  }

  if (type === "dimension" && isUnitValue(value)) {
    return `static let ${name}: CGFloat = ${expression}`;
  }

  if (type === "duration" && isUnitValue(value)) {
    return `static let ${name}: Double = ${expression}`;
  }

  if (typeof value === "number") {
    return `static let ${name}: ${Number.isInteger(value) ? "Int" : "Double"} = ${expression}`;
  }

  return `static let ${name} = ${expression}`;
}

function kotlinTokenValue(token, inheritedType) {
  const type = getTokenType(token, inheritedType);
  const value = getTokenValue(token);

  if (type === "color" && isColorValue(value)) {
    return toKotlinColor(value);
  }

  if (type === "duration" && isUnitValue(value)) {
    return String(value.value);
  }

  if (type === "dimension" && isUnitValue(value)) {
    return `${value.value}${isTypographyTextToken(token) ? ".sp" : ".dp"}`;
  }

  if (typeof value === "number" && !Number.isInteger(value)) {
    return `${value}f`;
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  return String(value);
}

function isTypographyTextToken(token) {
  return (
    token.path?.[0] === "typography" &&
    (token.path?.[1] === "fontSize" || token.path?.[1] === "lineHeight")
  );
}

function renderSwiftNode(node, inheritedType, indent = "  ") {
  const type = getTokenType(node, inheritedType);

  return Object.entries(node)
    .filter(([key]) => !key.startsWith("$") && key !== "type")
    .map(([key, value]) => {
      const childType = getTokenType(value, type);
      const hasTokenValue =
        Object.prototype.hasOwnProperty.call(value, "$value") ||
        Object.prototype.hasOwnProperty.call(value, "value");

      if (hasTokenValue) {
        return `${indent}${swiftTokenDeclaration(key, value, childType)}`;
      }

      return [
        `${indent}enum ${toNativeGroupName(key)} {`,
        renderSwiftNode(value, childType, `${indent}  `),
        `${indent}}`,
      ].join("\n");
    })
    .join("\n");
}

function renderKotlinNode(node, inheritedType, indent = "  ") {
  const type = getTokenType(node, inheritedType);

  return Object.entries(node)
    .filter(([key]) => !key.startsWith("$") && key !== "type")
    .map(([key, value]) => {
      const childType = getTokenType(value, type);
      const hasTokenValue =
        Object.prototype.hasOwnProperty.call(value, "$value") ||
        Object.prototype.hasOwnProperty.call(value, "value");

      if (hasTokenValue) {
        return `${indent}val ${toKotlinIdentifier(key)} = ${kotlinTokenValue(
          value,
          childType,
        )}`;
      }

      return [
        `${indent}object ${toNativeGroupName(key)} {`,
        renderKotlinNode(value, childType, `${indent}  `),
        `${indent}}`,
      ].join("\n");
    })
    .join("\n");
}

StyleDictionary.registerFormat({
  name: "react-native/theme",
  format: async ({ dictionary }) => {
    const theme = toPlainTheme(
      dictionary.tokens,
      undefined,
      toReactNativeValue,
    );

    return prettier.format(
      `/**
 * Do not edit directly, this file was auto-generated.
 */

export const theme = ${JSON.stringify(theme, null, 2)} as const;

export type Theme = typeof theme;
`,
      { parser: "typescript" },
    );
  },
});

StyleDictionary.registerFormat({
  name: "swiftui/theme",
  format: ({ dictionary }) => {
    return [
      "// Do not edit directly, this file was auto-generated.",
      "",
      "import SwiftUI",
      "",
      "enum SproutTheme {",
      renderSwiftNode(dictionary.tokens),
      "}",
      "",
    ].join("\n");
  },
});

StyleDictionary.registerFormat({
  name: "compose/theme",
  format: ({ dictionary }) => {
    return [
      "// Do not edit directly, this file was auto-generated.",
      "",
      "package com.sprout.tokens",
      "",
      "import androidx.compose.ui.graphics.Color",
      "import androidx.compose.ui.unit.dp",
      "import androidx.compose.ui.unit.sp",
      "",
      "object SproutTheme {",
      renderKotlinNode(dictionary.tokens),
      "}",
      "",
    ].join("\n");
  },
});

StyleDictionary.registerFormat({
  name: "json/usable-nested",
  format: async ({ dictionary }) => {
    const tokens = toPlainTheme(dictionary.tokens, undefined, toJsonValue);
    return prettier.format(JSON.stringify(tokens, null, 2), {
      parser: "json",
    });
  },
});

StyleDictionary.registerFormat({
  name: "css/sprout-variables",
  format: async ({ dictionary }) => {
    const variables = dictionary.allTokens
      .map((token) => `  --${token.name}: ${toCssValue(token)};`)
      .join("\n");

    return prettier.format(
      [
        "/**",
        " * Do not edit directly, this file was auto-generated.",
        " */",
        "",
        ":root {",
        variables,
        "}",
        "",
      ].join("\n"),
      { parser: "css" },
    );
  },
});

export default {
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transforms: ["attribute/cti", "name/kebab"],
      buildPath: "build/css/",
      files: [
        {
          destination: "variables.css",
          format: "css/sprout-variables",
        },
      ],
    },
    json: {
      transforms: ["attribute/cti", "name/kebab"],
      buildPath: "build/json/",
      files: [
        {
          destination: "tokens.json",
          format: "json/usable-nested",
        },
      ],
    },
    reactNative: {
      transforms: ["attribute/cti", "name/kebab"],
      buildPath: "build/react-native/",
      files: [
        {
          destination: "theme.ts",
          format: "react-native/theme",
        },
      ],
    },
    swiftUI: {
      transforms: ["attribute/cti", "name/kebab"],
      buildPath: "build/swiftui/",
      files: [
        {
          destination: "SproutTheme.swift",
          format: "swiftui/theme",
        },
      ],
    },
    compose: {
      transforms: ["attribute/cti", "name/kebab"],
      buildPath: "build/compose/",
      files: [
        {
          destination: "SproutTheme.kt",
          format: "compose/theme",
        },
      ],
    },
  },
};
