import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {RadioButtonType, RadioGroup} from './RadioGroup';
import type {RadioButtonSizeType} from './RadioButton';

const meta = {
  title: 'Inputs/RadioGroup',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          'A single-choice field for mutually exclusive options. Keep every option visible, use a group title when the choice needs context, and control the selected value from the parent form.',
      },
    },
  },
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
      description: 'Color variant of the radio buttons',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 16, 20, 24, 32],
      description:
        'Size can be "small" (16px), "medium" (20px), "large" (24px) or a custom number in pixels',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all radio buttons in the group',
    },
    title: {
      description: 'Optional title displayed above the radio group',
    },
    labelPosition: {
      description: 'Position of the label text relative to the radio button',
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
    data: ['development', 'staging', 'production'],
    labels: ['Development', 'Staging', 'Production'],
    selectedValue: 'staging',
    title: 'Deployment target',
    labelPosition: 'right',
    type: 'primary',
    size: 'medium',
    disabled: false,
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
    data: ['development', 'staging', 'production'],
    labels: ['Development', 'Staging', 'Production'],
    selectedValue: 'production',
    title: 'Large touch targets',
    labelPosition: 'right',
    type: 'primary',
    size: 28,
    disabled: false,
  },
  argTypes: {
    size: {
      control: {type: 'number', min: 12, max: 48, step: 2},
      description: 'Custom size in pixels',
    },
  },
};
