import React, {type ReactElement} from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryHeader,
  StoryRow,
  StorySection,
} from '../../../../.storybook/story-ui';
import {useCPK} from '../../../providers';
import {Button} from '../../uis/Button/Button';
import type {AlertDialogSizeType} from './AlertDialog';

type AlertDialogBasicStoryProps = {
  pattern: 'confirmation' | 'destructive';
  size: AlertDialogSizeType;
};

function AlertDialogBasicStory({
  pattern,
  size,
}: AlertDialogBasicStoryProps): ReactElement {
  const {alertDialog} = useCPK();
  const openConfirmation = () =>
    alertDialog.open({
      title: 'Publish this release?',
      body: 'The release will become available to everyone using the latest tag.',
      size,
      actions: [
        <Button
          color="light"
          key="cancel"
          onPress={() => alertDialog.close()}
          text="Cancel"
        />,
        <Button
          key="publish"
          onPress={() => alertDialog.close()}
          text="Publish release"
        />,
      ],
    });
  const openDestructive = () =>
    alertDialog.open({
      title: 'Delete this project?',
      body: 'This removes the project and its release history. This action cannot be undone.',
      showCloseButton: false,
      size,
      actions: [
        <Button
          color="light"
          key="cancel"
          onPress={() => alertDialog.close()}
          text="Keep project"
        />,
        <Button
          color="danger"
          key="delete"
          onPress={() => alertDialog.close()}
          text="Delete project"
        />,
      ],
    });

  return (
    <StoryCanvas>
      <StoryHeader
        description="Open each pattern to inspect focus, backdrop, actions, and dismissal behavior."
        title="Dialog patterns"
      />
      <StorySection label="Decision">
        <StoryRow>
          {pattern === 'confirmation' ? (
            <Button onPress={openConfirmation} text="Review publication" />
          ) : (
            <Button
              color="danger"
              onPress={openDestructive}
              text="Delete project"
            />
          )}
        </StoryRow>
      </StorySection>
    </StoryCanvas>
  );
}

const meta = {
  title: 'Feedback/AlertDialog',
  component: AlertDialogBasicStory,
  parameters: {
    docs: {
      description: {
        component:
          'A blocking decision surface opened through useCPK(). Keep the title specific, explain the consequence in the body, and reserve danger styling for irreversible actions.',
      },
    },
  },
  argTypes: {
    pattern: {
      control: 'radio',
      options: ['confirmation', 'destructive'],
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 14, 16, 18, 20],
      description:
        'Dialog size: "small" (14px title), "medium" (16px title), "large" (18px title), or custom number in pixels',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof AlertDialogBasicStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Confirmation: Story = {
  args: {
    pattern: 'confirmation',
    size: 'medium',
  },
};

export const DestructiveDecision: Story = {
  args: {
    pattern: 'destructive',
    size: 'medium',
  },
};
