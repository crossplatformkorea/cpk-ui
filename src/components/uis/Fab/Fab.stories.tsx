import type {ComponentProps} from 'react';
import {css} from 'kstyled';
import type {Meta, StoryObj} from '@storybook/react';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {Fab} from './Fab';

const meta = {
  title: 'Fab',
  component: (props) => <Fab {...props} />,
  argTypes: {
    icons: {
      control: 'select',
      options: ['MagnifyingGlass', 'Heart'],
    },
    isActive: {
      type: 'boolean',
    },
    style: css`
      bottom: 30px;
    `,
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof Fab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    icons: ['MagnifyingGlass', 'Heart'],
    isActive: true,
    animationDuration: 300,
    fabIcon: 'Plus',
    onPressFab: () => {},
    onPressItem: () => {},
  },
};
