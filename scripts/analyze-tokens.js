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

class TokenAnalyzer {
  constructor() {
    this.stats = {
      totalTokens: 0,
      tokensByType: {},
      tokensByTier: {
        'tier-1-definitions': 0,
        'tier-2-usage': 0,
        'tier-3-components': 0
      },
      fileCount: 0,
      colorCount: 0,
      dimensionCount: 0
    };
  }

  analyzeTokens(tokenObj, tier = 'unknown') {
    for (const [key, value] of Object.entries(tokenObj)) {
      if (typeof value === 'object' && value !== null) {
        if (value.hasOwnProperty('$value') || value.hasOwnProperty('value')) {
          // This is a token (supports both $value and value formats)
          this.stats.totalTokens++;
          this.stats.tokensByTier[tier]++;

          // Handle both $type and type, or infer from value
          let type = value.$type || value.type || 'unknown';

          // If no type specified, try to infer from the value
          if (type === 'unknown') {
            const tokenValue = value.$value || value.value;
            if (typeof tokenValue === 'string') {
              if (tokenValue.startsWith('#') || tokenValue.startsWith('rgb') || tokenValue.startsWith('hsl') || tokenValue.startsWith('oklch') || tokenValue.includes('color.')) {
                type = 'color';
              } else if (tokenValue.includes('px') || tokenValue.includes('rem') || tokenValue.includes('em') || tokenValue.includes('spacing.') || tokenValue.includes('size.')) {
                type = 'dimension';
              } else if (tokenValue.includes('ms') || tokenValue.includes('s') || tokenValue.includes('duration.')) {
                type = 'duration';
              } else if (tokenValue.includes('font') || tokenValue.includes('typography.')) {
                type = 'typography';
              }
            }
          }

          this.stats.tokensByType[type] = (this.stats.tokensByType[type] || 0) + 1;

          if (type === 'color') this.stats.colorCount++;
          if (type === 'dimension') this.stats.dimensionCount++;
        } else {
          // Recursively analyze nested objects
          this.analyzeTokens(value, tier);
        }
      }
    }
  }

  analyzeProject() {
    const projectRoot = path.resolve(__dirname, '..');
    const tokenDirs = [
      { path: 'light/tier-1-definitions', tier: 'tier-1-definitions' },
      { path: 'light/tier-2-usage', tier: 'tier-2-usage' },
      { path: 'light/tier-3-components', tier: 'tier-3-components' }
    ];

    console.log(`${colors.bold}${colors.cyan}📈 SPROUT DESIGN TOKEN ANALYSIS${colors.reset}`);
    console.log(`${colors.cyan}=================================${colors.reset}\n`);

    for (const { path: dirPath, tier } of tokenDirs) {
      const fullPath = path.join(projectRoot, dirPath);

      if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.json'));
        this.stats.fileCount += files.length;

        console.log(`${colors.blue}📁 Analyzing ${dirPath}${colors.reset}`);

        for (const file of files) {
          const filePath = path.join(fullPath, file);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const tokens = JSON.parse(content);

            console.log(`   ${colors.green}✓${colors.reset} ${file}`);
            this.analyzeTokens(tokens, tier);

          } catch (error) {
            console.log(`   ${colors.red}✗${colors.reset} ${file} - ${error.message}`);
          }
        }
        console.log();
      } else {
        console.log(`${colors.yellow}⚠️  Directory not found: ${dirPath}${colors.reset}\n`);
      }
    }
  }

  printStatistics() {
    console.log(`${colors.bold}${colors.magenta}📊 TOKEN STATISTICS${colors.reset}`);
    console.log(`${colors.magenta}==================${colors.reset}\n`);

    // Overall stats
    console.log(`${colors.bold}Overall:${colors.reset}`);
    console.log(`  Total tokens: ${colors.green}${this.stats.totalTokens}${colors.reset}`);
    console.log(`  Total files: ${colors.blue}${this.stats.fileCount}${colors.reset}`);
    console.log();

    // Tokens by tier
    console.log(`${colors.bold}Tokens by tier:${colors.reset}`);
    for (const [tier, count] of Object.entries(this.stats.tokensByTier)) {
      if (count > 0) {
        const percentage = ((count / this.stats.totalTokens) * 100).toFixed(1);
        console.log(`  ${tier.replace('tier-', 'Tier ')}: ${colors.cyan}${count}${colors.reset} (${percentage}%)`);
      }
    }
    console.log();

    // Tokens by type
    console.log(`${colors.bold}Tokens by type:${colors.reset}`);
    const sortedTypes = Object.entries(this.stats.tokensByType)
      .sort(([, a], [, b]) => b - a);

    for (const [type, count] of sortedTypes) {
      const percentage = ((count / this.stats.totalTokens) * 100).toFixed(1);
      const color = this.getTypeColor(type);
      console.log(`  ${type}: ${color}${count}${colors.reset} (${percentage}%)`);
    }
    console.log();
  }

  getTypeColor(type) {
    const typeColors = {
      color: colors.red,
      dimension: colors.blue,
      fontFamily: colors.magenta,
      fontWeight: colors.cyan,
      duration: colors.yellow,
      number: colors.green
    };
    return typeColors[type] || colors.reset;
  }

  generateRecommendations() {
    console.log(`${colors.bold}${colors.yellow}💡 RECOMMENDATIONS${colors.reset}`);
    console.log(`${colors.yellow}==================${colors.reset}\n`);

    const recommendations = [];

    // Check token distribution
    const tier1Ratio = this.stats.tokensByTier['tier-1-definitions'] / this.stats.totalTokens;
    const tier2Ratio = this.stats.tokensByTier['tier-2-usage'] / this.stats.totalTokens;
    const tier3Ratio = this.stats.tokensByTier['tier-3-components'] / this.stats.totalTokens;

    if (tier1Ratio > 0.7) {
      recommendations.push("Consider creating more semantic (tier-2) and component (tier-3) tokens to improve maintainability.");
    }

    if (tier2Ratio < 0.1 && this.stats.totalTokens > 20) {
      recommendations.push("Add tier-2 usage tokens to create semantic abstractions over your base tokens.");
    }

    if (tier3Ratio < 0.05 && this.stats.totalTokens > 50) {
      recommendations.push("Consider adding component-specific tokens for better design system organization.");
    }

    // Check token types
    if (!this.stats.tokensByType.color || this.stats.tokensByType.color < 10) {
      recommendations.push("Consider expanding your color palette for better design flexibility.");
    }

    if (!this.stats.tokensByType.dimension || this.stats.tokensByType.dimension < 5) {
      recommendations.push("Add more spacing and sizing tokens for consistent layouts.");
    }

    if (!this.stats.tokensByType.fontFamily) {
      recommendations.push("Define font family tokens for typographic consistency.");
    }

    // File organization
    if (this.stats.fileCount < 3) {
      recommendations.push("Consider organizing tokens into more specific files (colors, typography, spacing, etc.).");
    }

    if (recommendations.length === 0) {
      console.log(`${colors.green}🎉 Your token system looks well-organized! No specific recommendations at this time.${colors.reset}\n`);
    } else {
      recommendations.forEach((rec, index) => {
        console.log(`${colors.yellow}${index + 1}.${colors.reset} ${rec}`);
      });
      console.log();
    }
  }

  checkBuildStatus() {
    const projectRoot = path.resolve(__dirname, '..');
    const buildFile = path.join(projectRoot, 'light/build/css/tokens.css');

    if (fs.existsSync(buildFile)) {
      const stats = fs.statSync(buildFile);
      const buildDate = stats.mtime.toLocaleString();
      console.log(`${colors.bold}${colors.green}🏗️  BUILD STATUS${colors.reset}`);
      console.log(`${colors.green}===============${colors.reset}\n`);
      console.log(`${colors.green}✓${colors.reset} Build files exist`);
      console.log(`  Last built: ${colors.cyan}${buildDate}${colors.reset}\n`);
    } else {
      console.log(`${colors.bold}${colors.red}🏗️  BUILD STATUS${colors.reset}`);
      console.log(`${colors.red}===============${colors.reset}\n`);
      console.log(`${colors.red}✗${colors.reset} No build files found`);
      console.log(`  Run ${colors.cyan}npm run build:tokens${colors.reset} to generate build files\n`);
    }
  }

  run() {
    this.analyzeProject();
    this.printStatistics();
    this.generateRecommendations();
    this.checkBuildStatus();

    if (this.stats.totalTokens === 0) {
      console.log(`${colors.red}${colors.bold}No tokens found. Make sure you have JSON files in your token directories.${colors.reset}`);
      process.exit(1);
    }
  }
}

// Run the analyzer
const analyzer = new TokenAnalyzer();
analyzer.run();
