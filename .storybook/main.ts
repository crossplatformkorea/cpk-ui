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
    '@storybook/addon-react-native-web',
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

    // Expo/RN packages that contain class properties syntax and need babel transpilation
    const transpileModules = [
      '@expo/vector-icons',
      'expo-asset',
      'expo-modules-core',
      'expo-font',
    ];

    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      include: transpileModules.map((mod) =>
        path.resolve(__dirname, '../node_modules', mod),
      ),
      use: {
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          configFile: false,
          presets: [
            ['@babel/preset-env', {modules: false}],
            ['@babel/preset-react', {runtime: 'automatic'}],
            '@babel/preset-typescript',
          ],
          plugins: ['babel-plugin-react-native-web'],
        },
      },
    });

    return config;
  },
};
