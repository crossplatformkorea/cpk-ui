import type {ComponentProps} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {LoadingIndicator} from './LoadingIndicator';

const meta = {
  title: 'LoadingIndicator',
  component: (props) => <LoadingIndicator {...props} />,
  parameters: {
    notes: `
A loading indicator component that displays a spinner or custom loading animation.

## Features
- **Flexible Sizing**: Preset sizes and custom numeric values
- **Platform Adaptive**: Uses native ActivityIndicator on mobile platforms
- **Custom Colors**: Support for custom loading indicator colors
- **Custom Elements**: Can replace with custom loading animation

## Size Options
- \`small\`: 30px indicator
- \`medium\`: 40px indicator
- \`large\`: 50px indicator (default on native)
- Custom number: Any pixel value (e.g., \`size={45}\`)

## Platform Behavior
- **iOS/Android**: Uses native ActivityIndicator with "small" or "large" sizes
- **Web**: Custom implementation with flexible sizing
- **Medium size**: Maps to "large" on native platforms

## Usage
\`\`\`tsx
<LoadingIndicator
  size="medium"
  color="#0000FF"
/>
\`\`\`

### With Custom Element
\`\`\`tsx
<LoadingIndicator
  size={50}
  element={<CustomSpinner />}
/>
\`\`\`
        `,
    docs: {
      description: {
        component: `
A loading indicator component that displays a spinner or custom loading animation.

## Features
- **Flexible Sizing**: Preset sizes and custom numeric values
- **Platform Adaptive**: Uses native ActivityIndicator on mobile platforms
- **Custom Colors**: Support for custom loading indicator colors
- **Custom Elements**: Can replace with custom loading animation

## Size Options
- \`small\`: 30px indicator
- \`medium\`: 40px indicator
- \`large\`: 50px indicator (default on native)
- Custom number: Any pixel value (e.g., \`size={45}\`)

## Platform Behavior
- **iOS/Android**: Uses native ActivityIndicator with "small" or "large" sizes
- **Web**: Custom implementation with flexible sizing
- **Medium size**: Maps to "large" on native platforms

## Usage
\`\`\`tsx
<LoadingIndicator
  size="medium"
  color="#0000FF"
/>
\`\`\`

### With Custom Element
\`\`\`tsx
<LoadingIndicator
  size={50}
  element={<CustomSpinner />}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 20, 30, 40, 50],
      description: 'Indicator size: "small" (30px), "medium" (40px), "large" (50px), or custom number in pixels',
    },
    color: {
      description: 'Custom color for the loading indicator',
    },
    element: {
      description: 'Custom loading element to replace the default spinner',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof LoadingIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    size: 'medium',
  },
};
