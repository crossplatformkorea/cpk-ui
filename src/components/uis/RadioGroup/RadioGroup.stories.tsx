import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {RadioButtonType, RadioGroup} from './RadioGroup';
import type {RadioButtonSizeType} from './RadioButton';

const meta = {
  title: 'RadioGroup',
  component: (props) => <RadioGroup {...props} />,
  argTypes: {
    type: {
      control: 'select',
      options: [
        'danger',
        'info',
        'primary',
        'light',
        'secondary',
        'success',
        'warning',
      ] as RadioButtonType[],
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 16, 20, 24, 32],
      description: 'Size can be "small", "medium", "large" or a custom number',
    },
    disabled: {
      control: 'boolean',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState(args.selectedValue);

    return (
      <RadioGroup
        data={args.data}
        labels={args.labels}
        title={args.title}
        labelPosition={args.labelPosition}
        type={args.type}
        size={args.size}
        disabled={args.disabled}
        selectedValue={selectedValue}
        selectValue={setSelectedValue}
      />
    );
  },
  args: {
    theme: 'light',
    data: ['Person', 'Animal', 'Bird', 'Other'],
    labels: ['Person', 'Animal', 'Bird', 'Other'],
    selectedValue: 'Person',
    title: 'RadioGroup',
    labelPosition: 'right',
    type: 'primary',
    size: 'medium',
    disabled: false,
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export const CustomSize: Story = {
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState(args.selectedValue);

    return (
      <RadioGroup
        data={args.data}
        labels={args.labels}
        title={args.title}
        labelPosition={args.labelPosition}
        type={args.type}
        size={args.size}
        disabled={args.disabled}
        selectedValue={selectedValue}
        selectValue={setSelectedValue}
      />
    );
  },
  args: {
    theme: 'light',
    data: ['Person', 'Animal', 'Bird', 'Other'],
    labels: ['Person', 'Animal', 'Bird', 'Other'],
    selectedValue: 'Person',
    title: 'RadioGroup with Custom Size',
    labelPosition: 'right',
    type: 'primary',
    size: 28,
    disabled: false,
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
    size: {
      control: {type: 'number', min: 12, max: 48, step: 2},
      description: 'Custom size in pixels',
    },
  },
};
