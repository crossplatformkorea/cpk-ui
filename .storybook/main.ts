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

    const path = require('path');

    // Alias react-dom to shim that polyfills findDOMNode (removed in React 19,
    // still needed by react-native-web@0.21.x)
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom$': path.resolve(__dirname, 'react-dom-shim.js'),
    };

    // Expo/RN packages that contain class properties syntax and need babel transpilation
    const transpileModules = [
      '@expo/vector-icons',
      'expo-asset',
      'expo-modules-core',
      'expo-font',
    ];

    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      include: transpileModules.map(mod =>
        path.resolve(__dirname, '../node_modules', mod),
      ),
      use: {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            ['@babel/preset-env', {modules: false}],
            '@babel/preset-typescript',
          ],
          plugins: [
            '@babel/plugin-transform-class-properties',
            'babel-plugin-react-native-web',
          ],
        },
      },
    });

    return config;
  },
};
