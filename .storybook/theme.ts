import {create} from '@storybook/theming/create';

export const cpkStorybookTheme = create({
  base: 'light',
  brandTitle: 'cpk-ui',
  brandUrl: 'https://github.com/crossplatformkorea/cpk-ui',
  colorPrimary: '#111318',
  colorSecondary: '#2563EB',
  appBg: '#F3F5F8',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#F7F8FA',
  appBorderColor: '#D9DEE7',
  appBorderRadius: 6,
  fontBase:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  textColor: '#20242C',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#697180',
  barTextColor: '#596170',
  barSelectedColor: '#1D4ED8',
  barHoverColor: '#1D4ED8',
  barBg: '#FFFFFF',
  inputBg: '#FFFFFF',
  inputBorder: '#C9D0DB',
  inputTextColor: '#20242C',
  inputBorderRadius: 4,
});
