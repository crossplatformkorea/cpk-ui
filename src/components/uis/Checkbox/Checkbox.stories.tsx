import {type ComponentProps} from 'react';
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

const meta = {
  title: 'Checkbox',
  component: (props) => <Checkbox {...props} />,
  parameters: {
    notes: `
An animated Checkbox component with smooth transitions and flexible sizing options.

## Features
- **Smooth Animations**: Spring-based fade and scale animations
- **Flexible Sizing**: Preset sizes and custom numeric values
- **Color Variants**: Multiple color options for different contexts
- **Disabled State**: Can disable checkbox interaction
- **Icon Elements**: Add elements before or after the checkbox
- **Optimized Performance**: Memoized for better performance

## Size Options
- \`small\`: 16px checkbox
- \`medium\`: 20px checkbox (default)
- \`large\`: 24px checkbox
- Custom number: Any pixel value (e.g., \`size={28}\`)

## Animation Details
The checkbox uses two simultaneous animations:
- **Fade**: Opacity transition from 0 to 1
- **Scale**: Size transition from 0.8 to 1.0

## Usage

### With String Text
\`\`\`tsx
<Checkbox
  checked={isChecked}
  onPress={() => setIsChecked(!isChecked)}
  size="medium"
  color="primary"
  text="Accept terms"
  direction="right"
/>
\`\`\`

### With Custom Element
\`\`\`tsx
<Checkbox
  checked={isChecked}
  onPress={() => setIsChecked(!isChecked)}
  size="large"
  color="success"
  text={<CustomComponent />}
  direction="left"
/>
\`\`\`
        `,
    docs: {
      description: {
        component: `
An animated Checkbox component with smooth transitions and flexible sizing options.

## Features
- **Smooth Animations**: Spring-based fade and scale animations
- **Flexible Sizing**: Preset sizes and custom numeric values
- **Color Variants**: Multiple color options for different contexts
- **Disabled State**: Can disable checkbox interaction
- **Icon Elements**: Add elements before or after the checkbox
- **Optimized Performance**: Memoized for better performance

## Size Options
- \`small\`: 16px checkbox
- \`medium\`: 20px checkbox (default)
- \`large\`: 24px checkbox
- Custom number: Any pixel value (e.g., \`size={28}\`)

## Animation Details
The checkbox uses two simultaneous animations:
- **Fade**: Opacity transition from 0 to 1
- **Scale**: Size transition from 0.8 to 1.0

## Usage

### With String Text
\`\`\`tsx
<Checkbox
  checked={isChecked}
  onPress={() => setIsChecked(!isChecked)}
  size="medium"
  color="primary"
  text="Accept terms"
  direction="right"
/>
\`\`\`

### With Custom Element
\`\`\`tsx
<Checkbox
  checked={isChecked}
  onPress={() => setIsChecked(!isChecked)}
  size="large"
  color="success"
  text={<CustomComponent />}
  direction="left"
/>
\`\`\`
        `,
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
      description: 'Checkbox size: "small" (16px), "medium" (20px), "large" (24px), or custom number in pixels',
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
  args: {
    color: 'primary',
    size: 'medium',
    text: 'Click Checkbox!',
    direction: 'right',
    checked: false,
    onPress: () => {},
    theme: 'light',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export const WithLeftText: Story = {
  args: {
    color: 'primary',
    size: 'medium',
    text: 'Accept terms and conditions',
    direction: 'left',
    checked: false,
    onPress: () => {},
    theme: 'light',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export const WithCustomElement: Story = {
  args: {
    color: 'success',
    size: 'large',
    text: (
      <Typography.Body2
        style={css`
          font-weight: bold;
          color: #333;
        `}
      >
        Custom Element
      </Typography.Body2>
    ),
    direction: 'right',
    checked: true,
    onPress: () => {},
    theme: 'light',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};
