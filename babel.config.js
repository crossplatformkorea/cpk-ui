module.exports = (api) => {
  api.cache(true);

  const isStorybook =
    process.env.NODE_ENV === 'production' &&
    (process.env.STORYBOOK === '1' ||
      process.argv.some((arg) => arg.includes('storybook')));

  if (isStorybook) {
    // Simplified config for Storybook to avoid conflicts
    return {
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        [
          '@babel/preset-react',
          {runtime: 'automatic', importSource: '@emotion/react'},
        ],
      ],
      plugins: ['@emotion'],
    };
  }

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxRuntime: 'automatic',
        },
      ],
      '@babel/preset-typescript',
      [
        '@babel/preset-react',
        {runtime: 'automatic', importSource: '@emotion/react'},
      ],
    ],
    plugins: ['@emotion', 'react-native-reanimated/plugin'],
  };
};
