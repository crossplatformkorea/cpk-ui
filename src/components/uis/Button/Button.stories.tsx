import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';

import type {ButtonColorType, ButtonSizeType, ButtonType} from './Button';
import {Button} from './Button';
import {ThemeParam} from '../../../utils/theme';

const buttonTypes: ButtonType[] = ['outlined', 'solid', 'text'];
const buttonSizes: ButtonSizeType[] = ['large', 'medium', 'small'];

const buttonColors: ButtonColorType[] = [
  'primary',
  'success',
  'info',
  'warning',
  'danger',
  'light',
  'secondary',
];

const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    notes: `
A versatile Button component with multiple variants, sizes, and customization options.

## Features
- **Three Button Types**: Solid, outlined, and text buttons
- **Flexible Sizing**: Preset sizes and custom numeric values
- **Color Variants**: Multiple color options for different contexts
- **Loading State**: Built-in loading indicator
- **Icon Support**: Add icons before or after button text
- **Haptic Feedback**: Optional haptic feedback on press (mobile)
- **Hover Effects**: Automatic hover effects on web

## Size Options
- \`small\`: 8px vertical, 16px horizontal padding
- \`medium\`: 12px vertical, 24px horizontal padding (default)
- \`large\`: 16px vertical, 24px horizontal padding
- Custom number: Calculated as \`size * 0.6\` vertical, \`size * 1.2\` horizontal padding

## Button Types
- \`solid\`: Filled background with contrast text
- \`outlined\`: Transparent background with colored border
- \`text\`: Minimal styling, no border or background

## Usage
\`\`\`tsx
<Button
  text="Click me"
  type="solid"
  color="primary"
  size="medium"
  onPress={() => console.log('Pressed')}
/>
\`\`\`
        `,
    docs: {
      description: {
        component: `
A versatile Button component with multiple variants, sizes, and customization options.

## Features
- **Three Button Types**: Solid, outlined, and text buttons
- **Flexible Sizing**: Preset sizes and custom numeric values
- **Color Variants**: Multiple color options for different contexts
- **Loading State**: Built-in loading indicator
- **Icon Support**: Add icons before or after button text
- **Haptic Feedback**: Optional haptic feedback on press (mobile)
- **Hover Effects**: Automatic hover effects on web

## Size Options
- \`small\`: 8px vertical, 16px horizontal padding
- \`medium\`: 12px vertical, 24px horizontal padding (default)
- \`large\`: 16px vertical, 24px horizontal padding
- Custom number: Calculated as \`size * 0.6\` vertical, \`size * 1.2\` horizontal padding

## Button Types
- \`solid\`: Filled background with contrast text
- \`outlined\`: Transparent background with colored border
- \`text\`: Minimal styling, no border or background

## Usage
\`\`\`tsx
<Button
  text="Click me"
  type="solid"
  color="primary"
  size="medium"
  onPress={() => console.log('Pressed')}
/>
\`\`\`
        `,
      },
    },
  },
  args: {
    text: 'Hello world',
    type: 'solid',
    color: 'primary',
    size: 'medium',
    onPress: action('onPress'),
  },
  argTypes: {
    type: {
      control: 'select',
      options: buttonTypes,
      description: 'Visual style of the button (solid, outlined, or text)',
    },
    color: {
      control: 'select',
      options: buttonColors,
      description: 'Color variant of the button',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 16, 20, 24, 32],
      description: 'Button size: "small" (8/16px), "medium" (12/24px), "large" (16/24px), or custom number for calculated padding',
    },
  },
  decorators: [
    (Story, context) =>
      withThemeProvider(
        Story,
        context,
        // @ts-ignore
        context.args.theme,
      ),
  ],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    text: 'Basic Button',
    type: 'solid',
    color: 'primary',
    size: 'medium',
    onPress: action('onPress'),
  },
};

export const Secondary: Story = {
  args: {
    text: 'Secondary Button',
    type: 'outlined',
    color: 'secondary',
    size: 'large',
    onPress: action('onPress'),
  },
};

export const Danger: Story = {
  args: {
    text: 'Danger Button',
    type: 'solid',
    color: 'danger',
    size: 'small',
    onPress: action('onPress'),
  },
};

const disableAllExcept = (allowedField: string) => {
  const argTypes = {
    text: {table: {disable: true}},
    type: {table: {disable: true}},
    color: {table: {disable: true}},
    size: {table: {disable: true}},
    onPress: {table: {disable: true}},
    testID: {table: {disable: true}},
    disabled: {table: {disable: true}},
    loadingElement: {table: {disable: true}},
    borderRadius: {table: {disable: true}},
    startElement: {table: {disable: true}},
    endElement: {table: {disable: true}},
    activeOpacity: {table: {disable: true}},
    touchableHighlightProps: {table: {disable: true}},
    hitSlop: {table: {disable: true}},
    theme: {control: 'object'},
  };

  if (argTypes[allowedField]) {
    argTypes[allowedField] = {table: {disable: false}};
  }

  return argTypes;
};

export const CustomColor: Story = {
  args: {
    // @ts-ignore
    theme: {
      light: {
        button: {
          primary: {
            bg: 'red',
            text: 'white',
          },
        },
      },
      dark: {
        button: {
          primary: {
            bg: 'pink',
            text: 'red',
          },
        },
      },
    } as ThemeParam,
  },
  argTypes: disableAllExcept('theme'),
};
