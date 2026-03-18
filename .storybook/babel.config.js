module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    ['@babel/preset-react', {runtime: 'automatic'}],
  ],
  plugins: [
    '@babel/plugin-transform-class-properties',
    [
      'babel-plugin-kstyled',
      {
        debug: false,
        importName: 'kstyled',
        platformStyles: true,
        autoHoist: false,
      },
    ],
  ],
};
