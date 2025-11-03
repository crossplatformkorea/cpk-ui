import React, {type ReactElement} from 'react';
import type {ComponentProps} from 'react';
import {SafeAreaView} from 'react-native';
import {styled, css} from 'kstyled';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {useCPK} from '../../../providers';
import {Typography} from '../../uis/Typography/Typography';
import {Button} from '../../uis/Button/Button';
import AlertDialog, {type AlertDialogSizeType} from './AlertDialog';

const Container = styled(SafeAreaView)`
  flex-direction: column;
  padding: 48px 24px;
  align-self: stretch;
  justify-content: center;
  align-items: center;
`;

type AlertDialogBasicStoryProps = {
  size: AlertDialogSizeType;
};

function AlertDialogBasicStory({size}: AlertDialogBasicStoryProps): ReactElement {
  const {alertDialog} = useCPK();

  return (
    <Container>
      <Typography.Title>AlertDialog</Typography.Title>
      <Button
        color="primary"
        onPress={() =>
          alertDialog.open({
            title: 'Hello there!',
            body: 'This is an alert dialog.',
            size,
          })
        }
        style={{marginTop: 60, width: 200}}
        text="Dialog"
      />
      <Button
        color="primary"
        onPress={() =>
          alertDialog.open({
            title: 'Hello there!',
            body: 'This is an alert dialog.',
            size,
            actions: [
              <Button
                color="light"
                key="button-cancel"
                onPress={() => alertDialog.close()}
                text="Cancel"
              />,
              <Button
                key="button-ok"
                onPress={() => alertDialog.close()}
                text="OK"
              />,
            ],
          })
        }
        style={{marginTop: 20, width: 200}}
        text="With actions"
      />
    </Container>
  );
}

const meta = {
  title: 'AlertDialog',
  component: AlertDialogBasicStory,
  parameters: {
    notes: `
A modal dialog component for displaying important information or requiring user confirmation.

## Features
- **Flexible Sizing**: Preset sizes (small, medium, large) and custom numeric values
- **Customizable Actions**: Support for multiple action buttons
- **Backdrop Control**: Configurable backdrop opacity and outside click behavior
- **Close Button**: Optional close button in the header
- **Custom Content**: Support for custom title and body elements
- **Accessibility**: Built-in accessibility support with proper roles and labels

## Size Options
- \`small\`: 14px title, 12px body, 16px icon
- \`medium\`: 16px title, 14px body, 18px icon (default)
- \`large\`: 18px title, 16px body, 20px icon
- Custom number: Custom font size in pixels with proportional spacing

## Usage
\`\`\`tsx
const {alertDialog} = useCPK();

alertDialog.open({
  title: 'Confirm Action',
  body: 'Are you sure you want to proceed?',
  size: 'medium',
  actions: [
    <Button text="Cancel" onPress={() => alertDialog.close()} />,
    <Button text="Confirm" onPress={handleConfirm} />
  ]
});
\`\`\`

### Basic Dialog
\`\`\`tsx
alertDialog.open({
  title: 'Hello',
  body: 'This is a basic alert dialog.',
  size: 'medium',
});
\`\`\`

### With Custom Actions
\`\`\`tsx
alertDialog.open({
  title: 'Delete Item',
  body: 'This action cannot be undone.',
  size: 'large',
  actions: [
    <Button color="light" text="Cancel" onPress={() => alertDialog.close()} />,
    <Button color="danger" text="Delete" onPress={handleDelete} />
  ],
  showCloseButton: false
});
\`\`\`
        `,
    docs: {
      description: {
        component: `
A modal dialog component for displaying important information or requiring user confirmation.

## Features
- **Flexible Sizing**: Preset sizes (small, medium, large) and custom numeric values
- **Customizable Actions**: Support for multiple action buttons
- **Backdrop Control**: Configurable backdrop opacity and outside click behavior
- **Close Button**: Optional close button in the header
- **Custom Content**: Support for custom title and body elements
- **Accessibility**: Built-in accessibility support with proper roles and labels

## Size Options
- \`small\`: 14px title, 12px body, 16px icon
- \`medium\`: 16px title, 14px body, 18px icon (default)
- \`large\`: 18px title, 16px body, 20px icon
- Custom number: Custom font size in pixels with proportional spacing

## Usage
\`\`\`tsx
const {alertDialog} = useCPK();

alertDialog.open({
  title: 'Confirm Action',
  body: 'Are you sure you want to proceed?',
  size: 'medium',
  actions: [
    <Button text="Cancel" onPress={() => alertDialog.close()} />,
    <Button text="Confirm" onPress={handleConfirm} />
  ]
});
\`\`\`

### Basic Dialog
\`\`\`tsx
alertDialog.open({
  title: 'Hello',
  body: 'This is a basic alert dialog.',
  size: 'medium',
});
\`\`\`

### With Custom Actions
\`\`\`tsx
alertDialog.open({
  title: 'Delete Item',
  body: 'This action cannot be undone.',
  size: 'large',
  actions: [
    <Button color="light" text="Cancel" onPress={() => alertDialog.close()} />,
    <Button color="danger" text="Delete" onPress={handleDelete} />
  ],
  showCloseButton: false
});
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 14, 16, 18, 20],
      description: 'Dialog size: "small" (14px title), "medium" (16px title), "large" (18px title), or custom number in pixels',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof AlertDialogBasicStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    size: 'medium',
    // @ts-expect-error - theme is for storybook control
    theme: 'light',
  },
  argTypes: {
    // @ts-expect-error - theme is for storybook control
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};
