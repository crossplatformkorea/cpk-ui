import type {ComponentProps} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {EditText} from './EditText';

const meta = {
  title: 'EditText',
  component: (props) => <EditText {...props} />,
  parameters: {
    notes: `
A flexible text input component with various styling and validation options.

## Features
- **Flexible Sizing**: Preset sizes and custom numeric values
- **Two Decoration Styles**: Underline or boxed input styles
- **Layout Directions**: Row or column layout for label and input
- **Validation Support**: Built-in error message display
- **Character Counter**: Optional character counter with maxLength support
- **Multiline Support**: Can be used as a textarea
- **Secure Text Entry**: Password input support
- **Status States**: Visual feedback for focused, hovered, error, and disabled states
- **Custom Elements**: Support for left and right elements/icons

## Decoration Options
- \`underline\`: Bottom border style (default)
- \`boxed\`: Full border box style

## Direction Options
- \`row\`: Label and input side by side
- \`column\`: Label above input (default)

## Size Options
- \`small\`: 14px font size with proportional padding
- \`medium\`: 16px font size with proportional padding (default)
- \`large\`: 18px font size with proportional padding
- Custom number: Custom font size in pixels with proportional padding

## Usage
\`\`\`tsx
<EditText
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  size="medium"
  decoration="boxed"
  direction="column"
  required
/>
\`\`\`

### With Validation
\`\`\`tsx
<EditText
  label="Password"
  placeholder="Enter password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  error={passwordError}
  maxLength={20}
/>
\`\`\`
        `,
    docs: {
      description: {
        component: `
A flexible text input component with various styling and validation options.

## Features
- **Flexible Sizing**: Preset sizes and custom numeric values
- **Two Decoration Styles**: Underline or boxed input styles
- **Layout Directions**: Row or column layout for label and input
- **Validation Support**: Built-in error message display
- **Character Counter**: Optional character counter with maxLength support
- **Multiline Support**: Can be used as a textarea
- **Secure Text Entry**: Password input support
- **Status States**: Visual feedback for focused, hovered, error, and disabled states
- **Custom Elements**: Support for left and right elements/icons

## Decoration Options
- \`underline\`: Bottom border style (default)
- \`boxed\`: Full border box style

## Direction Options
- \`row\`: Label and input side by side
- \`column\`: Label above input (default)

## Size Options
- \`small\`: 14px font size with proportional padding
- \`medium\`: 16px font size with proportional padding (default)
- \`large\`: 18px font size with proportional padding
- Custom number: Custom font size in pixels with proportional padding

## Usage
\`\`\`tsx
<EditText
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  size="medium"
  decoration="boxed"
  direction="column"
  required
/>
\`\`\`

### With Validation
\`\`\`tsx
<EditText
  label="Password"
  placeholder="Enter password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  error={passwordError}
  maxLength={20}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 14, 16, 18, 20],
      description: 'Input size: "small" (14px), "medium" (16px), "large" (18px), or custom number in pixels',
    },
    required: {type: 'boolean', description: 'Shows required indicator'},
    label: {type: 'string', description: 'Label text for the input'},
    error: {type: 'string', description: 'Error message to display'},
    value: {type: 'string', description: 'Current input value'},
    multiline: {type: 'boolean', description: 'Enables multiline input'},
    placeholder: {type: 'string', description: 'Placeholder text'},
    placeholderColor: {type: 'string', description: 'Custom placeholder color'},
    editable: {type: 'boolean', description: 'Controls if input is editable'},
    secureTextEntry: {type: 'boolean', description: 'Hides text for password input'},
    numberOfLines: {type: 'number', description: 'Number of lines for multiline input'},
    maxLength: {type: 'number', description: 'Maximum character length'},
    hideCounter: {type: 'boolean', description: 'Hides character counter'},
    direction: {
      control: 'select',
      options: ['row', 'column'],
      description: 'Layout direction of label and input',
    },
    decoration: {
      control: 'select',
      options: ['underline', 'boxed'],
      description: 'Visual style of the input',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof EditText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    size: 'medium',
    onChangeText: () => {},
    direction: 'column',
    decoration: 'boxed',
    placeholder: 'Write something...',
    editable: true,
    theme: 'light',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};
