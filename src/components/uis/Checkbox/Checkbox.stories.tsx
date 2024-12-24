import {type ComponentProps} from 'react';
import {Text} from 'react-native';
import {css} from '@emotion/native';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {Checkbox, CheckboxColor} from './Checkbox';
import {Typography} from '../Typography/Typography';

const colors: CheckboxColor[] = [
  'primary',
  'success',
  'info',
  'warning',
  'danger',
  'secondary',
];

const meta = {
  title: 'Checkbox',
  component: (props) => <Checkbox {...props} />,
  argTypes: {
    color: {
      control: 'select',
      options: colors,
    },
    checked: {
      defaultValue: false,
      type: 'boolean',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    color: 'primary',
    endElement: <Typography.Body2>Click Checkbox!</Typography.Body2>,
    checked: false,
    onPress: () => {},
  },
};
