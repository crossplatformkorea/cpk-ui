import type {ComponentProps} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {SwitchToggle} from './SwitchToggle';
import {withThemeProvider} from '../../../../.storybook/decorators';

const meta = {
  title: 'SwitchToggle',
  component: (props) => <SwitchToggle {...props} />,
  argTypes: {},
  decorators: [withThemeProvider],
} satisfies Meta<typeof SwitchToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    isOn: false,
  },
};
