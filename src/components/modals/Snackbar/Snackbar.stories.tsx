import React, {type ReactElement} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {useCPK} from '../../../providers';
import {Button} from '../../uis/Button/Button';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryHeader,
  StoryRow,
  StorySection,
} from '../../../../.storybook/story-ui';
import type {SnackbarSizeType} from './Snackbar';

type SnackbarBasicStoryProps = {
  pattern: 'status' | 'undo';
  size: SnackbarSizeType;
};

function SnackbarBasicStory({
  pattern,
  size,
}: SnackbarBasicStoryProps): ReactElement {
  const {snackbar} = useCPK();

  return (
    <StoryCanvas>
      <StoryHeader
        description="Trigger a notice to inspect timing, placement, and optional actions."
        title="Feedback messages"
      />
      <StorySection label="Scenario">
        <StoryRow>
          {pattern === 'status' ? (
            <>
              <Button
                color="success"
                onPress={() =>
                  snackbar.open({
                    color: 'success',
                    size,
                    text: 'Release settings saved',
                  })
                }
                text="Show success"
              />
              <Button
                color="info"
                onPress={() =>
                  snackbar.open({
                    color: 'info',
                    size,
                    text: 'A new package version is available',
                  })
                }
                text="Show information"
              />
            </>
          ) : (
            <Button
              onPress={() =>
                snackbar.open({
                  actionText: 'Undo',
                  size,
                  text: 'Component removed from the release',
                })
              }
              text="Remove component"
            />
          )}
        </StoryRow>
      </StorySection>
    </StoryCanvas>
  );
}

const meta = {
  title: 'Feedback/Snackbar',
  component: SnackbarBasicStory,
  parameters: {
    docs: {
      description: {
        component:
          'Transient feedback presented above application content through useCPK(). Use a short message, add an action only when it can immediately reverse or continue the operation, and avoid stacking notices.',
      },
    },
  },
  argTypes: {
    pattern: {
      control: 'radio',
      options: ['status', 'undo'],
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 12, 14, 16, 18],
      description:
        'Snackbar size: "small" (12px text), "medium" (14px text), "large" (16px text), or custom number in pixels',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof SnackbarBasicStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const StatusMessages: Story = {
  args: {
    pattern: 'status',
    size: 'medium',
  },
};

export const UndoAction: Story = {
  args: {
    pattern: 'undo',
    size: 'medium',
  },
};
