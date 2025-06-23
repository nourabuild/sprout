#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class TokenValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.tokenCount = 0;
  }

  log(type, message) {
    const timestamp = new Date().toLocaleTimeString();
    switch (type) {
      case 'error':
        this.errors.push(message);
        console.log(`${colors.red}❌ [${timestamp}] ERROR: ${message}${colors.reset}`);
        break;
      case 'warning':
        this.warnings.push(message);
        console.log(`${colors.yellow}⚠️  [${timestamp}] WARNING: ${message}${colors.reset}`);
        break;
      case 'info':
        this.info.push(message);
        console.log(`${colors.blue}ℹ️  [${timestamp}] INFO: ${message}${colors.reset}`);
        break;
      case 'success':
        console.log(`${colors.green}✅ [${timestamp}] ${message}${colors.reset}`);
        break;
    }
  }

  isTokenReference(value) {
    // Check if value is a token reference like {color.noura.500}
    return typeof value === 'string' && value.startsWith('{') && value.endsWith('}') && value.includes('.');
  }

  validateDTCGFormat(tokenObj, path = []) {
    for (const [key, value] of Object.entries(tokenObj)) {
      const currentPath = [...path, key];

      if (typeof value === 'object' && value !== null) {
        // Check if this is a token (has $value property)
        if (value.hasOwnProperty('$value')) {
          this.tokenCount++;
          this.validateToken(value, currentPath);
        } else {
          // Recursively validate nested objects
          this.validateDTCGFormat(value, currentPath);
        }
      }
    }
  }

  validateToken(token, path) {
    const tokenPath = path.join('.');

    // Check required DTCG properties
    if (!token.hasOwnProperty('$value')) {
      this.log('error', `Token at ${tokenPath} missing required $value property`);
    }

    if (!token.hasOwnProperty('$type')) {
      // Be more helpful about what type should be used
      const suggestedType = this.suggestTokenType(token.$value, path);
      if (suggestedType) {
        this.log('warning', `Token at ${tokenPath} missing $type property. Suggested type: "${suggestedType}"`);
      } else {
        this.log('warning', `Token at ${tokenPath} missing $type property`);
      }
    }

    // Validate token types
    if (token.$type) {
      this.validateTokenType(token, tokenPath);
    }

    // Check naming conventions
    this.validateNaming(path);

    // Validate descriptions for complex tokens
    if (['shadow', 'gradient', 'typography'].includes(token.$type) && !token.$description) {
      this.log('warning', `Complex token at ${tokenPath} should have a $description`);
    }
  }

  suggestTokenType(value, path) {
    // Suggest token type based on value and path
    const pathStr = path.join('.').toLowerCase();

    if (pathStr.includes('color') || pathStr.includes('background') || pathStr.includes('border')) {
      return 'color';
    }

    if (pathStr.includes('font-weight') || pathStr.includes('weight')) {
      return 'fontWeight';
    }

    if (pathStr.includes('font-family') || pathStr.includes('family')) {
      return 'fontFamily';
    }

    if (pathStr.includes('text-transform') || pathStr.includes('transform')) {
      return 'string'; // text-transform values are strings
    }

    if (pathStr.includes('duration') || pathStr.includes('timing')) {
      return 'duration';
    }

    if (pathStr.includes('spacing') || pathStr.includes('space') || pathStr.includes('radius') || pathStr.includes('width')) {
      return 'dimension';
    }

    // Try to infer from value
    if (typeof value === 'string') {
      if (value.match(/^#[0-9A-Fa-f]{3,8}$/) || value.match(/^(rgb|hsl|oklch)\(/)) {
        return 'color';
      }
      if (value.match(/^[\d.]+(?:px|rem|em|%|vh|vw)$/)) {
        return 'dimension';
      }
      if (value.match(/^[\d.]+(?:s|ms)$/)) {
        return 'duration';
      }
      if (['none', 'uppercase', 'lowercase', 'capitalize'].includes(value)) {
        return 'string';
      }
    }

    if (typeof value === 'number') {
      if (value >= 100 && value <= 900 && value % 100 === 0) {
        return 'fontWeight';
      }
      return 'number';
    }

    return null;
  }

  validateTokenType(token, path) {
    const validTypes = [
      'color', 'dimension', 'fontFamily', 'fontWeight', 'duration',
      'cubicBezier', 'number', 'shadow', 'gradient', 'typography',
      'transition', 'strokeStyle', 'border', 'spacing', 'other'
    ];

    if (!validTypes.includes(token.$type)) {
      this.log('warning', `Token at ${path} has unknown $type: ${token.$type}`);
    }

    // Type-specific validations
    switch (token.$type) {
      case 'color':
        this.validateColor(token, path);
        break;
      case 'dimension':
        this.validateDimension(token, path);
        break;
      case 'fontWeight':
        this.validateFontWeight(token, path);
        break;
      case 'duration':
        this.validateDuration(token, path);
        break;
    }
  }

  validateColor(token, path) {
    const value = token.$value;

    // Check if it's a token reference (Style Dictionary format)
    if (this.isTokenReference(value)) {
      // This is a valid token reference, Style Dictionary will resolve it
      return;
    }

    const colorFormats = [
      /^#[0-9A-Fa-f]{3,8}$/, // Hex
      /^rgb\(/, // RGB
      /^rgba\(/, // RGBA
      /^hsl\(/, // HSL
      /^hsla\(/, // HSLA
      /^oklch\(/, // OKLCH
      /^lch\(/, // LCH
      /^lab\(/, // LAB
    ];

    const isValidColor = colorFormats.some(format => format.test(value));
    if (!isValidColor && typeof value === 'string') {
      this.log('error', `Invalid color format at ${path}: ${value}`);
    }
  }

  validateDimension(token, path) {
    const value = token.$value;

    // Check if it's a token reference (Style Dictionary format)
    if (this.isTokenReference(value)) {
      // This is a valid token reference, Style Dictionary will resolve it
      return;
    }

    // Allow negative values for dimensions (common in shadows, margins)
    if (typeof value === 'string' && !value.match(/^-?[\d.]+(?:px|rem|em|%|vh|vw|vmin|vmax)$/)) {
      this.log('error', `Invalid dimension format at ${path}: ${value}`);
    }
  }

  validateFontWeight(token, path) {
    const value = token.$value;

    // Check if it's a token reference
    if (this.isTokenReference(value)) {
      return;
    }

    // Convert string numbers to numbers for validation
    let numValue = value;
    if (typeof value === 'string' && !isNaN(value)) {
      numValue = parseInt(value, 10);
    }

    // Check numeric weights (including string representations)
    if (typeof numValue === 'number') {
      if (numValue < 100 || numValue > 900 || numValue % 100 !== 0) {
        this.log('warning', `Invalid font weight at ${path}: ${value}. Should be 100-900 in increments of 100`);
      }
    } else if (typeof value === 'string') {
      // Check named weights
      if (!['normal', 'bold', 'bolder', 'lighter'].includes(value)) {
        this.log('warning', `Invalid font weight at ${path}: ${value}`);
      }
    }
  }

  validateDuration(token, path) {
    const value = token.$value;

    // Check if it's a token reference (Style Dictionary format)
    if (this.isTokenReference(value)) {
      // This is a valid token reference, Style Dictionary will resolve it
      return;
    }

    if (typeof value === 'string' && !value.match(/^[\d.]+(?:s|ms)$/)) {
      this.log('error', `Invalid duration format at ${path}: ${value}`);
    }
  }

  validateNaming(path) {
    const tokenName = path.join('-');

    // Check for consistent naming patterns
    if (tokenName.includes('_')) {
      this.log('warning', `Token name contains underscore, prefer kebab-case: ${tokenName}`);
    }

    if (tokenName.match(/[A-Z]/)) {
      this.log('warning', `Token name contains uppercase, prefer kebab-case: ${tokenName}`);
    }

    // Check for meaningful names, but allow common single letters in context
    const allowedSingleLetters = ['x', 'y', 'z']; // Common for coordinates, z-index
    const problematicSegments = path.filter(segment =>
      segment.match(/^[a-z]$/) && !allowedSingleLetters.includes(segment)
    );

    if (problematicSegments.length > 0) {
      this.log('warning', `Single letter segment may not be descriptive: ${tokenName} (${problematicSegments.join(', ')})`);
    }
  }

  validateFileStructure() {
    const requiredDirs = ['light/tier-1-definitions', 'light/tier-2-usage', 'light/tier-3-components'];
    const projectRoot = path.resolve(__dirname, '..');

    for (const dir of requiredDirs) {
      const fullPath = path.join(projectRoot, dir);
      if (!fs.existsSync(fullPath)) {
        this.log('error', `Missing required directory: ${dir}`);
      } else {
        this.log('success', `Found directory: ${dir}`);
      }
    }
  }

  validateTokenFiles() {
    const projectRoot = path.resolve(__dirname, '..');
    const tokenDirs = [
      'light/tier-1-definitions',
      'light/tier-2-usage',
      'light/tier-3-components'
    ];

    for (const dir of tokenDirs) {
      const fullPath = path.join(projectRoot, dir);
      if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.json'));

        if (files.length === 0) {
          this.log('warning', `No JSON files found in ${dir}`);
          continue;
        }

        for (const file of files) {
          const filePath = path.join(fullPath, file);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const tokens = JSON.parse(content);

            this.log('info', `Validating ${path.join(dir, file)}`);
            this.validateDTCGFormat(tokens);

          } catch (error) {
            this.log('error', `Failed to parse ${path.join(dir, file)}: ${error.message}`);
          }
        }
      }
    }
  }

  validateBuildOutputs() {
    const projectRoot = path.resolve(__dirname, '..');
    const buildOutputs = [
      'light/build/css/tokens.css',
      'light/build/js/tokens.js',
      'light/build/json/tokens.json'
    ];

    let hasBuiltFiles = false;
    for (const output of buildOutputs) {
      const fullPath = path.join(projectRoot, output);
      if (fs.existsSync(fullPath)) {
        hasBuiltFiles = true;
        this.log('success', `Found build output: ${output}`);
      }
    }

    if (!hasBuiltFiles) {
      this.log('warning', 'No build outputs found. Run `npm run build:tokens` to generate files.');
    }
  }

  printSummary() {
    console.log(`\n${colors.bold}${colors.cyan}📊 VALIDATION SUMMARY${colors.reset}`);
    console.log(`${colors.cyan}===================${colors.reset}\n`);

    console.log(`${colors.blue}Tokens validated: ${colors.bold}${this.tokenCount}${colors.reset}`);
    console.log(`${colors.red}Errors: ${colors.bold}${this.errors.length}${colors.reset}`);
    console.log(`${colors.yellow}Warnings: ${colors.bold}${this.warnings.length}${colors.reset}`);
    console.log(`${colors.blue}Info messages: ${colors.bold}${this.info.length}${colors.reset}\n`);

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(`${colors.green}${colors.bold}🎉 All validations passed! Your design tokens look great!${colors.reset}\n`);
      return true;
    } else if (this.errors.length === 0) {
      console.log(`${colors.yellow}${colors.bold}⚠️  Validation completed with warnings. Consider addressing them.${colors.reset}\n`);
      return true;
    } else {
      console.log(`${colors.red}${colors.bold}❌ Validation failed with errors. Please fix them before proceeding.${colors.reset}\n`);
      return false;
    }
  }

  run() {
    console.log(`${colors.bold}${colors.magenta}🔍 SPROUT DESIGN TOKEN VALIDATOR${colors.reset}`);
    console.log(`${colors.magenta}===================================${colors.reset}\n`);

    this.log('info', 'Starting validation process...');

    // Validate project structure
    this.log('info', 'Checking project structure...');
    this.validateFileStructure();

    // Validate token files
    this.log('info', 'Validating token files...');
    this.validateTokenFiles();

    // Check build outputs
    this.log('info', 'Checking build outputs...');
    this.validateBuildOutputs();

    // Print summary
    const success = this.printSummary();

    // Exit with appropriate code
    process.exit(success ? 0 : 1);
  }
}

// Run the validator
const validator = new TokenValidator();
validator.run();
