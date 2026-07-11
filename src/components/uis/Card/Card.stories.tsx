import React from 'react';
import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryRow,
  StorySection,
  StoryStack,
  StoryText,
} from '../../../../.storybook/story-ui';

import {Card} from './Card';

const meta = {
  title: 'Display/Card',
  component: Card,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'A bounded surface for related content. Cards can remain passive or expose a press action with an explicit accessibility label.',
      },
    },
  },
  args: {
    borderRadius: 8,
    elevation: 2,
    padding: 16,
  },
  argTypes: {
    elevation: {control: {min: 0, max: 12, type: 'range'}},
    borderRadius: {control: {min: 0, max: 24, type: 'range'}},
    padding: {control: {min: 0, max: 32, type: 'range'}},
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: <StoryText>Project activity is up to date.</StoryText>,
  },
};

export const ElevationScale: Story = {
  render: () => (
    <StoryCanvas>
      <StorySection label="Elevation">
        <StoryRow style={{alignItems: 'stretch'}}>
          {[0, 2, 6].map((elevation) => (
            <Card elevation={elevation} key={elevation} style={{minWidth: 150}}>
              <StoryStack>
                <StoryText>Level {elevation}</StoryText>
                <StoryText>Surface hierarchy</StoryText>
              </StoryStack>
            </Card>
          ))}
        </StoryRow>
      </StorySection>
    </StoryCanvas>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card accessibilityLabel="Open release details" onPress={action('onPress')}>
      <StoryStack>
        <StoryText>Release candidate</StoryText>
        <StoryText>Open details</StoryText>
      </StoryStack>
    </Card>
  ),
};
