import type {Preview} from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },

    backgrounds: {
      default: 'light',
      values: [
        {name: 'light', value: '#ffffff'},
        {name: 'dark', value: '#333333'},
      ],
    },
  },

  globals: {
    theme: 'light', // 기본값 설정
  },

  globalTypes: {
    theme: {
      name: 'Theme', // 툴바의 레이블
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          {value: 'light', title: 'Light'},
          {value: 'dark', title: 'Dark'},
        ],
        showName: true,
      },
    },
  },

  tags: ['autodocs'],
};

export default preview;
