module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
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
