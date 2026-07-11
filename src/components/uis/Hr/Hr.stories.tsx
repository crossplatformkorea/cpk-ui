import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StorySection,
  StoryStack,
  StoryText,
} from '../../../../.storybook/story-ui';

import {Hr} from './Hr';

const meta = {
  title: 'Display/Hr',
  component: Hr,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'A theme-aware horizontal divider for separating adjacent content groups without adding another container.',
      },
    },
  },
} satisfies Meta<typeof Hr>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InContent: Story = {
  render: () => (
    <StoryCanvas>
      <StorySection label="Section divider">
        <StoryStack>
          <StoryText>Account details</StoryText>
          <Hr />
          <StoryText>Notification preferences</StoryText>
        </StoryStack>
      </StorySection>
      <StorySection label="Custom weight">
        <Hr style={{height: 2}} />
      </StorySection>
    </StoryCanvas>
  ),
};
