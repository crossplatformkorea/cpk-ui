/** @type{import("@storybook/react-webpack5").StorybookConfig} */
module.exports = {
  stories: [
    '../src/docs/**/*.mdx',
    '../src/docs/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-react-native-web',
      options: {
        babelPlugins: [
          ['@babel/plugin-transform-class-properties', {loose: true}],
          'react-native-reanimated/plugin',
        ],
        modulesToTranspile: [
          'react-native-gesture-handler',
          'react-native-reanimated',
          'react-native-svg',
        ],
      },
    },
    '@storybook/addon-webpack5-compiler-babel',
    '@chromatic-com/storybook',
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  docs: {
    defaultName: 'Docs',
  },

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

    const path = require('path');
    const webpack = require('webpack');

    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.EXPO_OS': JSON.stringify('web'),
      }),
      new webpack.ContextReplacementPlugin(
        /src[\\/]components$/,
        /^\.\/.*\.stories\.(?:js|jsx|ts|tsx)$/,
      ),
    );

    // Alias react-dom to shim that polyfills findDOMNode (removed in React 19,
    // still needed by react-native-web@0.21.x)
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom$': path.resolve(__dirname, 'react-dom-shim.js'),
    };

    return config;
  },
};
