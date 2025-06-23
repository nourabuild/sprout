import StyleDictionary from 'style-dictionary';
import minimist from 'minimist';
import { formatCss, oklch } from 'culori';

/**
 * Configuration constants
 */
const AVAILABLE_THEMES = ['light', 'dark'];
const BASE_FONT_SIZE = 16;

/**
 * Command line arguments
 */
const args = minimist(process.argv.slice(2));
const theme = args.theme;

/**
 * Helper functions
 */
const isHigherTierToken = (filePath) => {
    return filePath.includes('tier-2-usage') || filePath.includes('tier-3-components');
};

const cleanTokenPath = (path) => {
    return path
        .map((segment) => (segment.startsWith('@') ? segment.substring(1) : segment))
        .filter((segment) => segment !== '')
        .join('-');
};

const formatTokenName = (cleanPath, isThemeToken) => {
    return isThemeToken ? `--ds-theme-${cleanPath}` : `--ds-${cleanPath}`;
};

/**
 * Token transformation utilities
 */
const transformShadowTokens = (dictionary, size) => {
    const shadowProps = dictionary.allTokens.filter(
        (p) => isHigherTierToken(p.filePath) && p.path[0] === 'box-shadow' && p.path[1] === size
    );

    const getValue = (type, fallback = '0px') =>
        shadowProps.find((p) => p.path[2] === type)?.value || fallback;

    const x = getValue('x');
    const y = getValue('y');
    const blur = getValue('blur');
    const spread = getValue('spread');
    const color = getValue('color', 'transparent');

    return `${x} ${y} ${blur} ${spread} ${color}`;
};

const transformLineHeight = (dictionary, prop) => {
    const cleanPath = cleanTokenPath(prop.path);
    const fontSizePath = [...prop.path.slice(0, -1), 'font-size'];
    const fontSizeProp = dictionary.allTokens.find(
        (p) => p.path.join('.') === fontSizePath.join('.')
    );

    if (fontSizeProp) {
        const lineHeightPx = parseFloat(prop.value.replace('rem', '')) * 16;
        const fontSizePx = parseFloat(fontSizeProp.value.replace('rem', '')) * 16;
        const unitlessValue = (lineHeightPx / fontSizePx).toFixed(2);
        return `  --ds-theme-${cleanPath}: ${unitlessValue};`;
    }

    return `  --ds-theme-${cleanPath}: ${prop.value};`;
};

/**
 * OKLCH Color transformation utilities
 */
const hexToOklch = (hex) => {
    try {
        const oklchColor = oklch(hex);
        if (oklchColor) {
            return formatCss(oklchColor);
        }
    } catch (error) {
        console.warn(`Failed to convert ${hex} to OKLCH:`, error.message);
    }
    return hex; // Fallback to original hex if conversion fails
};

const isOklchColor = (value) => {
    return typeof value === 'string' && value.startsWith('oklch(');
};

const isHexColor = (value) => {
    return typeof value === 'string' && value.startsWith('#');
};

/**
 * CSS Variables formatter
 */
const formatVariables = (dictionary) => {
    const processedShadows = new Set();
    const tier1Tokens = [];
    const themeTokens = [];

    // Get unique shadow sizes
    const shadowSizes = dictionary.tokens.shadow ?
        Object.keys(dictionary.tokens.shadow)
            .map((key) => key.split('-')[0])
            .filter((value, index, self) => self.indexOf(value) === index)
        : [];

    dictionary.allTokens.forEach((prop) => {
        const cleanPath = cleanTokenPath(prop.path);
        const isThemeToken = isHigherTierToken(prop.filePath);

        // Handle z-index tokens
        if (prop.path[0] === 'z-index') {
            tier1Tokens.push(`  ${formatTokenName(cleanPath, isThemeToken)}: ${prop.value};`);
            return;
        }

        // Handle box-shadow transformations
        if (isThemeToken && prop.path[0] === 'box-shadow' && shadowSizes.includes(prop.path[1])) {
            const size = prop.path[1];
            if (!processedShadows.has(size)) {
                processedShadows.add(size);
                const shadowValue = transformShadowTokens(dictionary, size);
                themeTokens.push(`  --ds-theme-box-shadow-${size}: ${shadowValue};`);
            }
            return;
        }

        // Handle line height transformations
        if (isThemeToken && prop.path[0] === 'typography' && prop.path.includes('line-height')) {
            themeTokens.push(transformLineHeight(dictionary, prop));
            return;
        }

        // Handle all other tokens
        if (!prop.path.includes('box-shadow') || prop.path.length > 3) {
            const token = `  ${formatTokenName(cleanPath, isThemeToken)}: ${prop.value};`;
            if (isThemeToken) {
                themeTokens.push(token);
            } else {
                tier1Tokens.push(token);
            }
        }
    });

    return [...new Set([...tier1Tokens, ...themeTokens])].join('\n');
};

/**
 * Register custom transforms and formats globally
 */
// Register DTCG parser
StyleDictionary.registerParser({
    name: 'dtcg-parser',
    pattern: /\.json$/,
    parser: ({ contents, filePath }) => {
        const obj = JSON.parse(contents);

        function transformTokens(tokens, path = []) {
            const result = {};

            for (const [key, value] of Object.entries(tokens)) {
                if (value && typeof value === 'object') {
                    if (value.$value !== undefined) {
                        // This is a token with DTCG format
                        result[key] = {
                            value: value.$value,
                            type: value.$type,
                            ...(value.$description && { description: value.$description }),
                            filePath,
                            path: [...path, key]
                        };
                    } else {
                        // This is a group, recurse
                        result[key] = transformTokens(value, [...path, key]);
                    }
                }
            }

            return result;
        }

        return transformTokens(obj);
    }
});

// Register transforms
StyleDictionary.registerTransform({
    name: 'size/px-to-rem',
    type: 'value',
    filter: (token) => token.value && typeof token.value === 'string' && token.value.endsWith('px'),
    transform: (token) => {
        const pixels = parseFloat(token.value);
        if (isNaN(pixels)) return token.value;
        return `${(pixels / BASE_FONT_SIZE).toFixed(4)}rem`;
    }
});

// OKLCH Color transforms
StyleDictionary.registerTransform({
    name: 'color/oklch-passthrough',
    type: 'value',
    filter: (token) => token.$type === 'color' && isOklchColor(token.value),
    transform: (token) => {
        // Pass through OKLCH values as-is for modern browsers
        return token.value;
    }
});

StyleDictionary.registerTransform({
    name: 'color/hex-to-oklch',
    type: 'value',
    filter: (token) => token.$type === 'color' && isHexColor(token.value),
    transform: (token) => {
        // Convert hex to OKLCH (requires culori library for production)
        return hexToOklch(token.value);
    }
});

StyleDictionary.registerTransform({
    name: 'color/oklch-with-fallback',
    type: 'value',
    filter: (token) => token.$type === 'color',
    transform: (token) => {
        if (isOklchColor(token.value)) {
            // For OKLCH values, keep as is (browser support is growing)
            return token.value;
        } else if (isHexColor(token.value)) {
            // For hex values, you could convert to OKLCH here
            // For now, keep hex for backward compatibility
            return token.value;
        }
        return token.value;
    }
});

StyleDictionary.registerTransform({
    name: 'name/theme-prefix',
    type: 'name',
    transform: (token) => {
        const cleanPath = cleanTokenPath(token.path);
        const prefix = isHigherTierToken(token.filePath) ? 'DsTheme' : 'Ds';
        return `${prefix}${cleanPath
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join('')}`;
    }
});

// Register transform groups
StyleDictionary.registerTransformGroup({
    name: 'web',
    transforms: ['attribute/cti', 'name/kebab', 'color/oklch-with-fallback']
});

StyleDictionary.registerTransformGroup({
    name: 'web-oklch',
    transforms: ['attribute/cti', 'name/kebab', 'color/hex-to-oklch']
});

StyleDictionary.registerTransformGroup({
    name: 'js',
    transforms: ['attribute/cti', 'name/theme-prefix', 'color/oklch-with-fallback']
});

// Register formats
StyleDictionary.registerFormat({
    name: 'css/custom-variables',
    format: (dictionary) => `:root {\n${formatVariables(dictionary)}\n}`
});

StyleDictionary.registerFormat({
    name: 'css/variables-themed',
    format: ({ dictionary, options }) => {
        const themeName = options.theme || 'light';
        return `.${themeName} {\n${formatVariables(dictionary)}\n}\n`;
    }
});

StyleDictionary.registerFormat({
    name: 'json/flat/custom',
    format: (dictionary) => {
        const transformedTokens = {};

        // Get shadow sizes
        const shadowSizes = dictionary.tokens.shadow ?
            Object.keys(dictionary.tokens.shadow)
                .map((key) => key.split('-')[0])
                .filter((value, index, self) => self.indexOf(value) === index)
            : [];

        // Process regular tokens
        dictionary.allTokens.forEach((token) => {
            if (token.path[0] === 'box-shadow' && token.path.length > 2) return;
            const prefix = isHigherTierToken(token.filePath) ? 'ds-theme-' : 'ds-';
            transformedTokens[`${prefix}${token.path.join('-')}`] = token.value;
        });

        // Process shadow tokens
        shadowSizes.forEach((size) => {
            transformedTokens[`ds-theme-box-shadow-${size}`] = transformShadowTokens(dictionary, size);
        });

        return JSON.stringify(transformedTokens, null, 2);
    }
});

/**
 * Style Dictionary configuration factory
 */
const createStyleDictionaryConfig = (theme) => {
    return new StyleDictionary({
        source: [
            `./${theme}/tier-1-definitions/*.json`,
            `./${theme}/tier-2-usage/*.json`,
            `./${theme}/tier-3-components/*.json`
        ],
        parsers: ['dtcg-parser'],
        log: { verbosity: 'verbose' },

        platforms: {
            css: {
                transformGroup: 'web',
                buildPath: `./${theme}/build/css/`,
                files: [
                    {
                        destination: 'tokens.css',
                        format: 'css/custom-variables'
                    },
                    {
                        destination: `${theme}.css`,
                        format: 'css/variables-themed',
                        options: {
                            theme: theme
                        }
                    }
                ]
            },

            js: {
                transformGroup: 'js',
                buildPath: `./${theme}/build/js/`,
                files: [
                    {
                        destination: 'tokens.js',
                        format: 'javascript/es6'
                    },
                    {
                        destination: 'tokens.d.ts',
                        format: 'typescript/es6-declarations'
                    }
                ]
            },

            json: {
                transformGroup: 'web',
                buildPath: `./${theme}/build/json/`,
                files: [
                    {
                        destination: 'tokens.json',
                        format: 'json/flat/custom'
                    }
                ]
            }
        }
    });
};

/**
 * Build tokens
 */
const buildTokens = () => {
    if (!theme) {
        console.log('🚧 Building all themes...');
        AVAILABLE_THEMES.forEach((themeName) => {
            console.log(`\n🏗️ Building ${themeName.toUpperCase()} theme`);
            const sd = createStyleDictionaryConfig(themeName);
            sd.buildAllPlatforms();
        });
    } else {
        console.log(`🚧 Building ${theme.toUpperCase()} theme`);
        const sd = createStyleDictionaryConfig(theme);
        sd.buildAllPlatforms();
    }
};

// Execute build
buildTokens();
