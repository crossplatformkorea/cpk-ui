import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StorySection,
  StorySurface,
  StoryText,
} from '../../../../.storybook/story-ui';
import {useTheme} from '../../../providers/ThemeProvider';

import type {StatusBarBrightnessProps} from './StatusBarBrightness';
import {StatusBarBrightness} from './StatusBarBrightness';

function StatusBarPreview({type}: StatusBarBrightnessProps) {
  const {themeType} = useTheme();
  const resolvedType =
    type ?? (themeType === 'light' ? 'dark-content' : 'light-content');

  return (
    <StoryCanvas>
      <StatusBarBrightness type={type} />
      <StorySection label="Resolved appearance">
        <StorySurface>
          <StoryText>Theme: {themeType}</StoryText>
          <StoryText>Bar style: {resolvedType}</StoryText>
        </StorySurface>
      </StorySection>
    </StoryCanvas>
  );
}

const meta = {
  title: 'System/StatusBarBrightness',
  component: StatusBarBrightness,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'Synchronizes the native status-bar foreground with the active theme or an explicit bar style. Web renders the resolved value for parity checks.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'light-content', 'dark-content'],
    },
  },
} satisfies Meta<typeof StatusBarBrightness>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Automatic: Story = {
  render: (args) => <StatusBarPreview {...args} />,
};

export const Explicit: Story = {
  args: {type: 'light-content'},
  render: (args) => <StatusBarPreview {...args} />,
};
