import type {ComponentProps} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {LoadingIndicator} from './LoadingIndicator';

const meta = {
  title: 'LoadingIndicator',
  component: (props) => <LoadingIndicator {...props} />,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'large'],
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof LoadingIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    size: 'small',
  },
};
