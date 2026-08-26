module.exports = (api) => {
  api.cache(true);

  const isStorybook =
    process.env.STORYBOOK === '1' ||
    process.argv.some((arg) => arg.includes('storybook'));

  if (isStorybook) {
    // Simplified config for Storybook to avoid conflicts
    return {
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        ['@babel/preset-react', {runtime: 'automatic'}],
      ],
      plugins: [
        ['babel-plugin-kstyled', {strict: true}],
        // Worklets in <Calendar>'s pager/page must be transformed here too,
        // or the stories build and then throw on first paint.
        'react-native-reanimated/plugin',
      ],
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
    ],
    plugins: [
      ['babel-plugin-kstyled', {strict: true}],
      'react-native-reanimated/plugin',
    ],
  };
};
