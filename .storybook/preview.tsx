import type {Preview} from '@storybook/react';

import {cpkStorybookTheme} from './theme';
import './preview.css';

const viewports = {
  compactMobile: {
    name: 'Compact mobile',
    styles: {height: '568px', width: '320px'},
    type: 'mobile',
  },
  mobile: {
    name: 'Mobile',
    styles: {height: '844px', width: '390px'},
    type: 'mobile',
  },
  tablet: {
    name: 'Tablet',
    styles: {height: '1024px', width: '768px'},
    type: 'tablet',
  },
  desktop: {
    name: 'Desktop',
    styles: {height: '900px', width: '1440px'},
    type: 'desktop',
  },
};

const preview: Preview = {
  parameters: {
    a11y: {
      test: 'error',
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      sort: 'requiredFirst',
    },

    backgrounds: {
      default: 'light',
      values: [
        {name: 'light', value: '#ffffff'},
        {name: 'muted', value: '#f3f5f8'},
        {name: 'dark', value: '#17191d'},
      ],
    },

    docs: {
      source: {
        state: 'closed',
      },
      theme: cpkStorybookTheme,
      toc: true,
    },

    layout: 'fullscreen',

    options: {
      panelPosition: 'right',
      storySort: {
        order: [
          'Overview',
          ['Introduction', 'Release 0.7.0', 'Engineering Notes'],
          'Foundations',
          ['Colors', 'Typography'],
          'Actions',
          'Inputs',
          'Feedback',
          'Display',
          'Media',
          'System',
        ],
      },
    },

    viewport: {viewports},
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
        icon: 'paintbrush',
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
