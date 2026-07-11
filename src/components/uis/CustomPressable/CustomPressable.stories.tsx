import React, {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StorySection,
  StorySurface,
  StoryText,
} from '../../../../.storybook/story-ui';

import {CustomPressable} from './CustomPressable';

function InteractionPreview() {
  const [presses, setPresses] = useState(0);

  return (
    <StorySurface>
      <CustomPressable
        accessibilityLabel="Increment press count"
        onPress={() => setPresses((count) => count + 1)}
        style={{padding: 14}}
      >
        <StoryText>Press feedback</StoryText>
      </CustomPressable>
      <StoryText>
        Pressed {presses} {presses === 1 ? 'time' : 'times'}
      </StoryText>
    </StorySurface>
  );
}

const meta = {
  title: 'Actions/CustomPressable',
  component: CustomPressable,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'A low-level press target that normalizes hover, pressed, and hit-slop behavior across native and web. Prefer Button or IconButton for standard commands.',
      },
    },
  },
} satisfies Meta<typeof CustomPressable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interaction: Story = {
  render: () => (
    <StoryCanvas>
      <StorySection label="Pressed state and hit slop">
        <InteractionPreview />
      </StorySection>
    </StoryCanvas>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StoryCanvas>
      <StorySection label="Unavailable action">
        <StorySurface>
          <CustomPressable
            accessibilityLabel="Unavailable action"
            disabled
            onPress={() => {}}
            style={{opacity: 0.45, padding: 14}}
          >
            <StoryText>Unavailable action</StoryText>
          </CustomPressable>
        </StorySurface>
      </StorySection>
    </StoryCanvas>
  ),
};
