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
  parameters: {
    notes: `
A flexible Icon component with a comprehensive icon library and size presets.

## Features
- **Extensive Icon Library**: Large collection of commonly used icons
- **Flexible Sizing**: Preset sizes and custom numeric values
- **Color Customization**: Support for custom icon colors
- **Optimized Performance**: Efficiently rendered vector icons

## Size Options
- \`small\`: 18px icon
- \`medium\`: 24px icon (default)
- \`large\`: 32px icon
- Custom number: Any pixel value (e.g., \`size={40}\`)

## Available Icons
The component includes a wide variety of icons such as:
- UI elements (MagnifyingGlass, Bell, Settings, etc.)
- Actions (Check, X, Plus, Minus, etc.)
- Navigation (ChevronUp, ChevronDown, ArrowLeft, ArrowRight, etc.)
- And many more...

## Usage
\`\`\`tsx
<Icon
  name="MagnifyingGlass"
  size="medium"
  color="#000000"
/>
\`\`\`
        `,
    docs: {
      description: {
        component: `
A flexible Icon component with a comprehensive icon library and size presets.

## Features
- **Extensive Icon Library**: Large collection of commonly used icons
- **Flexible Sizing**: Preset sizes and custom numeric values
- **Color Customization**: Support for custom icon colors
- **Optimized Performance**: Efficiently rendered vector icons

## Size Options
- \`small\`: 18px icon
- \`medium\`: 24px icon (default)
- \`large\`: 32px icon
- Custom number: Any pixel value (e.g., \`size={40}\`)

## Available Icons
The component includes a wide variety of icons such as:
- UI elements (MagnifyingGlass, Bell, Settings, etc.)
- Actions (Check, X, Plus, Minus, etc.)
- Navigation (ChevronUp, ChevronDown, ArrowLeft, ArrowRight, etc.)
- And many more...

## Usage
\`\`\`tsx
<Icon
  name="MagnifyingGlass"
  size="medium"
  color="#000000"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: iconList,
      description: 'Name of the icon to display',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 16, 24, 32, 48],
      description: 'Icon size: "small" (18px), "medium" (24px), "large" (32px), or custom number in pixels',
    },
    color: {
      description: 'Custom color for the icon',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    name: 'MagnifyingGlass',
    size: 'medium',
  },
};
