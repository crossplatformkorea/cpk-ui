import type {Meta, StoryObj} from '@storybook/react';
import {Typography} from './Typography';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {ScrollView, View} from 'react-native';
import {ThemeParam} from '../../../utils/theme';

const meta = {
  title: 'Typography',
  component: Typography.Title,
  parameters: {
    notes: `
A comprehensive typography system with predefined text styles for consistent design.

## Features
- **Pre-defined Text Styles**: Multiple typography variants for different use cases
- **Theme Integration**: Automatically uses theme colors and styles
- **Responsive**: Works across all platforms (iOS, Android, Web)
- **Customizable**: Can override styles while maintaining base typography

## Available Typography Variants
- **Title**: Large heading text
- **Heading1**: Primary heading
- **Heading2**: Secondary heading
- **Heading3**: Tertiary heading
- **Subtitle1**: Large subtitle
- **Subtitle2**: Standard subtitle
- **Body1**: Primary body text
- **Body2**: Secondary body text
- **Body3**: Tertiary body text
- **Body4**: Small body text
- **Caption**: Small caption text
- **Button**: Button text style

## Usage
\`\`\`tsx
<Typography.Title>Page Title</Typography.Title>
<Typography.Heading1>Main Heading</Typography.Heading1>
<Typography.Body1>This is body text.</Typography.Body1>
<Typography.Caption>Small caption text</Typography.Caption>
\`\`\`

### With Custom Styling
\`\`\`tsx
<Typography.Body1 style={{color: 'blue', fontWeight: 'bold'}}>
  Custom styled text
</Typography.Body1>
\`\`\`
        `,
    docs: {
      description: {
        component: `
A comprehensive typography system with predefined text styles for consistent design.

## Features
- **Pre-defined Text Styles**: Multiple typography variants for different use cases
- **Theme Integration**: Automatically uses theme colors and styles
- **Responsive**: Works across all platforms (iOS, Android, Web)
- **Customizable**: Can override styles while maintaining base typography

## Available Typography Variants
- **Title**: Large heading text
- **Heading1**: Primary heading
- **Heading2**: Secondary heading
- **Heading3**: Tertiary heading
- **Subtitle1**: Large subtitle
- **Subtitle2**: Standard subtitle
- **Body1**: Primary body text
- **Body2**: Secondary body text
- **Body3**: Tertiary body text
- **Body4**: Small body text
- **Caption**: Small caption text
- **Button**: Button text style

## Usage
\`\`\`tsx
<Typography.Title>Page Title</Typography.Title>
<Typography.Heading1>Main Heading</Typography.Heading1>
<Typography.Body1>This is body text.</Typography.Body1>
<Typography.Caption>Small caption text</Typography.Caption>
\`\`\`

### With Custom Styling
\`\`\`tsx
<Typography.Body1 style={{color: 'blue', fontWeight: 'bold'}}>
  Custom styled text
</Typography.Body1>
\`\`\`
        `,
      },
    },
  },
  argTypes: {},
  decorators: [withThemeProvider],
} satisfies Meta<typeof Typography.Title>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllTypography: Story = {
  render: (args) => (
    <ScrollView contentContainerStyle={{padding: 16}}>
      {Object.entries(Typography).map(([key, Component]) => (
        <View key={key} style={{marginBottom: 16}}>
          <Component {...args}>
            {key} {args.children}
          </Component>
        </View>
      ))}
    </ScrollView>
  ),
  args: {
    children: 'Hello world',
    // @ts-expect-error - theme is for storybook control
    theme: 'light',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export const CustomTitle: Story = {
  args: {
    children: 'Custom Color',
    // @ts-ignore
    theme: {
      light: {
        text: {
          basic: 'blue',
        },
      },
      dark: {
        text: {
          basic: 'skyblue',
        },
      },
    } as ThemeParam,
  },
  decorators: [
    (Story, context) =>
      withThemeProvider(
        Story,
        context,
        // @ts-ignore
        context.args.theme as ThemeParam,
      ),
  ],
};
