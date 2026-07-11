import {useState, type ComponentProps} from 'react';
import {Text} from 'react-native';
import {css} from 'kstyled';
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

function InteractiveCheckbox(props: ComponentProps<typeof Checkbox>) {
  const [checked, setChecked] = useState(props.checked ?? false);

  return (
    <Checkbox
      {...props}
      checked={checked}
      onPress={() => {
        setChecked((value) => !value);
        props.onPress?.();
      }}
    />
  );
}

const meta = {
  title: 'Inputs/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'A multi-select control for independent choices. Make the label part of the press target, keep checked state controlled by the parent, and use disabled only when the choice cannot currently change.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: colors,
      description: 'Color variant of the checkbox',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 16, 20, 24, 32],
      description:
        'Checkbox size: "small" (16px), "medium" (20px), "large" (24px), or custom number in pixels',
    },
    checked: {
      defaultValue: false,
      type: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      description: 'Disables checkbox interaction',
    },
    direction: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Position of the text relative to the checkbox',
    },
    text: {
      description: 'Text or custom element to display next to the checkbox',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => <InteractiveCheckbox {...args} />,
  args: {
    color: 'primary',
    size: 'medium',
    text: 'Include prerelease builds',
    direction: 'right',
    checked: false,
    onPress: () => {},
  },
};

export const WithLeftText: Story = {
  render: (args) => <InteractiveCheckbox {...args} />,
  args: {
    color: 'primary',
    size: 'medium',
    text: 'Set as default channel',
    direction: 'left',
    checked: false,
    onPress: () => {},
  },
};

export const WithCustomElement: Story = {
  render: (args) => <InteractiveCheckbox {...args} />,
  args: {
    color: 'success',
    size: 'large',
    text: (
      <Typography.Body2
        style={css`
          font-weight: bold;
        `}
      >
        Notify release managers
      </Typography.Body2>
    ),
    direction: 'right',
    checked: true,
    onPress: () => {},
  },
};
