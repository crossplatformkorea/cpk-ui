import type {ComponentProps} from 'react';
import {css} from 'kstyled';
import type {Meta, StoryObj} from '@storybook/react';
import {Accordion} from './Accordion';
import {withThemeProvider} from '../../../../.storybook/decorators';

const meta = {
  title: 'Accordion',
  component: Accordion,
  decorators: [withThemeProvider],
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    animDuration: 200,
    collapseOnStart: true,
    onPressItem: () => {},
    data: [
      {
        title: 'Item 1',
        items: ['User', 'Mail', 'Text'],
      },
      {
        title: 'Item 2',
        items: ['User', 'Mail', 'Text'],
      },
      {
        title: 'Item 3',
        items: ['User', 'Mail', 'Text'],
      },
    ],
    shouldAnimate: true,
  },
};
