import React, {type ReactElement} from 'react';
import type {ComponentProps} from 'react';
import {SafeAreaView} from 'react-native';
import {styled, css} from 'kstyled';
import type {Meta, StoryObj} from '@storybook/react';
import {useCPK} from '../../../providers';
import {Typography} from '../../uis/Typography/Typography';
import {Button} from '../../uis/Button/Button';
import {withThemeProvider} from '../../../../.storybook/decorators';
import Snackbar, {type SnackbarSizeType} from './Snackbar';

const Container = styled(SafeAreaView)`
  flex-direction: column;
  padding: 48px 24px;
  align-self: stretch;
  justify-content: center;
  align-items: center;
`;

type SnackbarBasicStoryProps = {
  size: SnackbarSizeType;
};

function SnackbarBasicStory({size}: SnackbarBasicStoryProps): ReactElement {
  const {snackbar} = useCPK();

  return (
    <Container>
      <Typography.Title>Snackbar</Typography.Title>
      <Button
        color="primary"
        onPress={() =>
          snackbar.open({
            text: 'Hello there!',
            size,
          })
        }
        style={{marginTop: 60, width: 200}}
        text="Snackbar"
      />
      <Button
        color="primary"
        onPress={() =>
          snackbar.open({
            text: 'Hello there!',
            actionText: 'Cancel',
            size,
          })
        }
        style={{marginTop: 20, width: 200}}
        text="With action"
      />
      <Button
        color="info"
        onPress={() =>
          snackbar.open({
            text: 'Hello there!',
            color: 'info',
            size,
          })
        }
        style={{marginTop: 20, width: 200}}
        text="Color = info"
      />
      <Button
        color="danger"
        onPress={() =>
          snackbar.open({
            text: 'Hello there!',
            color: 'danger',
            size,
          })
        }
        style={{marginTop: 20, width: 200}}
        text="Color = danger"
      />
      <Button
        color="light"
        onPress={() =>
          snackbar.open({
            text: 'Hello there!',
            color: 'light',
            size,
          })
        }
        style={{marginTop: 20, width: 200}}
        text="Color = light"
      />
    </Container>
  );
}

const meta = {
  title: 'Snackbar',
  component: SnackbarBasicStory,
  parameters: {
    docs: {
      description: {
        component: `
A brief message component that appears at the bottom of the screen to provide feedback about an operation.

## Features
- **Flexible Sizing**: Preset sizes (small, medium, large) and custom numeric values
- **Color Variants**: Support for primary, info, danger, light, and other theme colors
- **Action Button**: Optional action button with custom text
- **Auto-dismiss**: Automatically dismisses after a configurable timer
- **Customizable**: Custom styles for container, text, and action elements

## Size Options
- \`small\`: 12px text, 14px icon
- \`medium\`: 14px text, 16px icon (default)
- \`large\`: 16px text, 18px icon
- Custom number: Custom font size in pixels with proportional spacing

## Usage
\`\`\`tsx
const {snackbar} = useCPK();

snackbar.open({
  text: 'Item saved successfully',
  size: 'medium',
  color: 'primary',
});
\`\`\`

### Basic Snackbar
\`\`\`tsx
snackbar.open({
  text: 'Hello there!',
  size: 'medium',
});
\`\`\`

### With Action Button
\`\`\`tsx
snackbar.open({
  text: 'Item deleted',
  actionText: 'Undo',
  size: 'large',
  color: 'danger',
});
\`\`\`

### With Custom Timer
\`\`\`tsx
snackbar.open({
  text: 'Connection established',
  size: 'small',
  color: 'info',
  timer: 5000, // 5 seconds
});
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 12, 14, 16, 18],
      description: 'Snackbar size: "small" (12px text), "medium" (14px text), "large" (16px text), or custom number in pixels',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof SnackbarBasicStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    size: 'medium',
  },
};
