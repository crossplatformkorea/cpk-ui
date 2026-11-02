import {create} from '@storybook/theming/create';

// The palette is cpk-ui's own light tokens (src/utils/colors.ts), so the
// workbench reads in the same ink, paper and signal blue as the components.
const ink = '#1B1B1B';
const label = '#4D4D4D';
const signal = '#3D8BFF';
// The signal blue is 3.3:1 on white; text uses this 5.3:1 shade of it.
const link = '#1A66D9';
const mist = '#EDEDED';
const pretendard =
  '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif';

export const cpkStorybookTheme = create({
  base: 'light',
  brandTitle:
    '<span style="font-family:\'Pretendard Variable\',Pretendard,sans-serif;font-size:19px;font-weight:800;letter-spacing:-0.02em;color:#1B1B1B">cpk-ui</span>',
  brandUrl: 'https://github.com/crossplatformkorea/cpk-ui',
  brandTarget: '_blank',
  colorPrimary: ink,
  colorSecondary: signal,
  appBg: '#F7F7F7',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: mist,
  appBorderRadius: 10,
  fontBase: pretendard,
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  textColor: ink,
  textInverseColor: '#FFFFFF',
  textMutedColor: label,
  barTextColor: label,
  barSelectedColor: link,
  barHoverColor: link,
  barBg: '#FFFFFF',
  buttonBg: '#FFFFFF',
  buttonBorder: mist,
  booleanBg: mist,
  booleanSelectedBg: '#FFFFFF',
  inputBg: '#FFFFFF',
  inputBorder: '#CCCCCC',
  inputTextColor: ink,
  inputBorderRadius: 8,
});
