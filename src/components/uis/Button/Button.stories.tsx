import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';

import type {ButtonColorType, ButtonSizeType, ButtonType} from './Button';
import {Button} from './Button';

const buttonTypes: ButtonType[] = ['outlined', 'solid', 'text'];
const buttonSizes: ButtonSizeType[] = ['large', 'medium', 'small'];

const buttonColors: ButtonColorType[] = [
  'primary',
  'success',
  'info',
  'warning',
  'danger',
  'light',
  'secondary',
];

const meta = {
  title: 'Button',
  component: Button,
  args: {
    text: 'Hello world',
    type: 'solid',
    color: 'primary',
    size: 'medium',
    onPress: action('onPress'),
  },
  argTypes: {
    type: {
      control: 'select',
      options: buttonTypes,
    },
    color: {
      control: 'select',
      options: buttonColors,
    },
    size: {
      control: 'select',
      options: buttonSizes,
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    text: 'Basic Button',
    type: 'solid',
    color: 'primary',
    size: 'medium',
    onPress: action('onPress'),
  },
};

export const Secondary: Story = {
  args: {
    text: 'Secondary Button',
    type: 'outlined',
    color: 'secondary',
    size: 'large',
    onPress: action('onPress'),
  },
};

export const Danger: Story = {
  args: {
    text: 'Danger Button',
    type: 'solid',
    color: 'danger',
    size: 'small',
    onPress: action('onPress'),
  },
};
