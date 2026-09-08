import React, {type ReactElement} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {View} from 'react-native';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryHeader,
  StoryRow,
  StorySection,
} from '../../../../.storybook/story-ui';
import {useCPK} from '../../../providers';
import {Button} from '../../uis/Button/Button';
import {Icon} from '../../uis/Icon/Icon';
import {Typography} from '../../uis/Typography/Typography';
import type {AlertDialogSizeType} from './AlertDialog';

type AlertDialogBasicStoryProps = {
  pattern: 'confirmation' | 'destructive' | 'blocking' | 'spacious';
  size: AlertDialogSizeType;
};

function AlertDialogBasicStory({
  pattern,
  size,
}: AlertDialogBasicStoryProps): ReactElement {
  const {alertDialog, theme} = useCPK();
  const openSpacious = () =>
    alertDialog.open({
      title: 'Transfer ownership',
      renderHeader: () => (
        <View style={{gap: 20, flexShrink: 0}}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.button.warning.bg,
            }}
          >
            <Icon name="Crown" size={32} color={theme.button.warning.text} />
          </View>
          <Typography.Heading5>Transfer ownership</Typography.Heading5>
        </View>
      ),
      renderBody: () => (
        <Typography.Body2>
          This cannot be undone. Make Alex the new owner?
        </Typography.Body2>
      ),
      backdropOpacity: 0.46,
      showCloseButton: false,
      closeOnTouchOutside: false,
      styles: {
        container: {
          flex: 0,
          flexBasis: 'auto',
          width: '88%',
          maxWidth: 360,
          paddingTop: 28,
          paddingBottom: 28,
          paddingLeft: 28,
          paddingRight: 28,
          borderRadius: 18,
        },
        bodyContainer: {marginTop: 12, marginBottom: 0},
        actionContainer: {
          marginTop: 32,
          justifyContent: 'flex-end',
          paddingRight: 0,
        },
      },
      renderActions: ({close}) => [
        <Button
          key="cancel"
          text="Cancel"
          type="text"
          color="light"
          style={{flex: 0, flexBasis: 'auto'}}
          styles={{text: {color: theme.text.label}}}
          onPress={close}
        />,
        <Button
          key="transfer"
          text="Transfer"
          type="text"
          color="warning"
          style={{flex: 0, flexBasis: 'auto'}}
          onPress={close}
        />,
      ],
    });
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
          {pattern === 'spacious' ? (
            <Button onPress={openSpacious} text="Review ownership" />
          ) : pattern === 'confirmation' ? (
            <Button onPress={openConfirmation} text="Review publication" />
          ) : pattern === 'destructive' ? (
            <Button
              color="danger"
              onPress={openDestructive}
              text="Delete project"
            />
          ) : (
            <Button
              onPress={() =>
                alertDialog.open({
                  closeOnTouchOutside: false,
                  title: 'Set nickname',
                  body: 'Choose a unique handle. Outside taps do not dismiss this dialog.',
                  actions: [
                    <Button
                      key="set"
                      onPress={() => alertDialog.close()}
                      text="Set"
                    />,
                  ],
                })
              }
              text="Open blocking dialog"
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
      options: ['confirmation', 'destructive', 'blocking', 'spacious'],
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

export const DarkConfirmation: Story = {
  args: {pattern: 'confirmation', size: 'medium'},
  globals: {theme: 'dark'},
};

export const SpaciousDecision: Story = {
  args: {pattern: 'spacious', size: 'medium'},
};
