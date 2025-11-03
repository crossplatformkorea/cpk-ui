import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {RadioButtonType, RadioGroup} from './RadioGroup';
import type {RadioButtonSizeType} from './RadioButton';

const meta = {
  title: 'RadioGroup',
  component: (props) => <RadioGroup {...props} />,
  parameters: {
    notes: `
A flexible RadioGroup component that allows users to select a single option from a set of choices.

## Features
- **Flexible Sizing**: Supports preset sizes (small, medium, large) and custom numeric values
- **Color Variants**: Multiple color options for different contexts
- **Disabled State**: Can disable the entire radio group
- **Optional Title**: Display an optional title above the radio group
- **Label Positioning**: Position labels on the left or right of radio buttons

## Size Options
- \`small\`: 16px radio button
- \`medium\`: 20px radio button (default)
- \`large\`: 24px radio button
- Custom number: Any pixel value (e.g., \`size={28}\`)

## Usage
\`\`\`tsx
<RadioGroup
  data={['Option 1', 'Option 2', 'Option 3']}
  labels={['Option 1', 'Option 2', 'Option 3']}
  selectedValue="Option 1"
  selectValue={setSelectedValue}
  size="medium"
  type="primary"
  title="Choose an option"
/>
\`\`\`
        `,
    docs: {
      description: {
        component: `
A flexible RadioGroup component that allows users to select a single option from a set of choices.

## Features
- **Flexible Sizing**: Supports preset sizes (small, medium, large) and custom numeric values
- **Color Variants**: Multiple color options for different contexts
- **Disabled State**: Can disable the entire radio group
- **Optional Title**: Display an optional title above the radio group
- **Label Positioning**: Position labels on the left or right of radio buttons

## Size Options
- \`small\`: 16px radio button
- \`medium\`: 20px radio button (default)
- \`large\`: 24px radio button
- Custom number: Any pixel value (e.g., \`size={28}\`)

## Usage
\`\`\`tsx
<RadioGroup
  data={['Option 1', 'Option 2', 'Option 3']}
  labels={['Option 1', 'Option 2', 'Option 3']}
  selectedValue="Option 1"
  selectValue={setSelectedValue}
  size="medium"
  type="primary"
  title="Choose an option"
/>
\`\`\`
        `,
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
      description: 'Size can be "small" (16px), "medium" (20px), "large" (24px) or a custom number in pixels',
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
