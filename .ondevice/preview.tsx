import {withBackgrounds} from '@storybook/addon-ondevice-backgrounds';
import type {Preview} from '@storybook/react';

const preview: Preview = {
  decorators: [withBackgrounds],

  parameters: {
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },

    backgrounds: {
      default: 'light', // 기본 배경 설정
      values: [
        {name: 'light', value: '#ffffff'},
        {name: 'dark', value: '#333333'},
      ],
    },

    previewTabs: {
      'storybook/docs/panel': {
        index: -1,
        title: 'Notes',
      },
    },
  },

  initialGlobals: {
    theme: 'light',
  },

  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          {value: 'light', title: 'Light'},
          {value: 'dark', title: 'Dark'},
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },

  tags: ['autodocs'],
};

export default preview;
