import type {ComponentProps} from 'react';
import {View} from 'react-native';
import {css} from 'kstyled';
import type {Meta, StoryObj} from '@storybook/react';
import {Icon, iconList} from './Icon';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {Typography} from '../Typography/Typography';

const meta = {
  title: 'Icon',
  component: (props) => (
    <View
      style={css`
        align-items: center;
      `}
    >
      <Icon {...props} />
      <Typography.Body2
        style={css`
          font-size: 12px;
          text-align: center;
        `}
      >
        {props?.name}
      </Typography.Body2>
    </View>
  ),
  argTypes: {
    name: {
      control: 'select',
      options: iconList,
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    name: 'MagnifyingGlass',
  },
};
