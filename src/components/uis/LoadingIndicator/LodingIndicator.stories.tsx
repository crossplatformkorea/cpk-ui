import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryRow,
  StorySection,
  StoryStack,
  StoryText,
} from '../../../../.storybook/story-ui';
import {LoadingIndicator} from './LoadingIndicator';

const meta = {
  title: 'Feedback/LoadingIndicator',
  component: LoadingIndicator,
  parameters: {
    docs: {
      description: {
        component:
          'Indicates indeterminate progress with a native activity indicator where available and a matching web treatment. Use it only when completion cannot be expressed as a determinate value.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 20, 30, 40, 50],
      description:
        'Indicator size: "small" (30px), "medium" (40px), "large" (50px), or custom number in pixels',
    },
    color: {
      description: 'Custom color for the loading indicator',
    },
    customElement: {
      description: 'Custom loading element to replace the default spinner',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof LoadingIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    size: 'medium',
  },
};

export const SizesAndContent: Story = {
  render: () => (
    <StoryCanvas>
      <StorySection label="Sizes">
        <StoryRow style={{alignItems: 'flex-end'}}>
          {(['small', 'medium', 'large', 64] as const).map((size) => (
            <StoryStack key={String(size)} style={{alignItems: 'center'}}>
              <LoadingIndicator size={size} />
              <StoryText>{String(size)}</StoryText>
            </StoryStack>
          ))}
        </StoryRow>
      </StorySection>
      <StorySection label="Custom element">
        <LoadingIndicator
          customElement={
            <View
              style={{
                backgroundColor: '#307EF1',
                borderRadius: 4,
                height: 24,
                width: 24,
              }}
            />
          }
        />
      </StorySection>
    </StoryCanvas>
  ),
};
