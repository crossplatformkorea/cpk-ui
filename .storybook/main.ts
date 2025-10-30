/** @type{import("@storybook/react-webpack5").StorybookConfig} */
module.exports = {
  stories: [
    '../src/components/**/*.stories.mdx',
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-toolbars',
    '@storybook/addon-backgrounds',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-react-native-web',
    '@storybook/addon-webpack5-compiler-babel',
    '@chromatic-com/storybook',
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  docs: {},

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  webpackFinal: async (config) => {
    // Add fallback for Node.js modules that are not available in the browser
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      console: false, // Disable console polyfill for @testing-library/react-native
      fs: false,
      path: false,
      os: false,
    };

    // Ensure babel-loader processes our src files BEFORE TypeScript
    const path = require('path');
    const srcPath = path.resolve(__dirname, '../src');

    // Find the babel-loader rule
    const babelRule = config.module.rules.find(rule =>
      rule.test && rule.test.toString().includes('jsx')
    );

    if (babelRule && babelRule.use) {
      // Make sure our src directory is explicitly included
      babelRule.include = [srcPath];
      console.log('[Storybook] Configured babel-loader to process:', srcPath);
    }

    return config;
  },
};
