import React from 'react';
import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryRow,
  StorySection,
} from '../../../../.storybook/story-ui';

import {IconButton} from './IconButton';

const onPress = action('onPress');

const meta = {
  title: 'Actions/IconButton',
  component: IconButton,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'A compact icon-only command with shared Button variants, sizes, loading, and disabled states. Always provide an accessibilityLabel.',
      },
    },
  },
  args: {
    accessibilityLabel: 'Search',
    color: 'primary',
    icon: 'MagnifyingGlass',
    onPress,
    size: 'medium',
    type: 'solid',
  },
  argTypes: {
    color: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
        'info',
        'light',
      ],
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 40],
    },
    type: {
      control: 'radio',
      options: ['solid', 'outlined', 'text'],
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <StoryCanvas>
      <StorySection label="Styles">
        <StoryRow>
          <IconButton icon="MagnifyingGlass" onPress={onPress} type="solid" />
          <IconButton
            icon="MagnifyingGlass"
            onPress={onPress}
            type="outlined"
          />
          <IconButton icon="MagnifyingGlass" onPress={onPress} type="text" />
        </StoryRow>
      </StorySection>
      <StorySection label="Sizes">
        <StoryRow>
          <IconButton icon="Bell" onPress={onPress} size="small" />
          <IconButton icon="Bell" onPress={onPress} size="medium" />
          <IconButton icon="Bell" onPress={onPress} size="large" />
          <IconButton icon="Bell" onPress={onPress} size={40} />
        </StoryRow>
      </StorySection>
      <StorySection label="States">
        <StoryRow>
          <IconButton icon="Check" onPress={onPress} />
          <IconButton disabled icon="Check" onPress={onPress} />
          <IconButton icon="Check" loading onPress={onPress} />
        </StoryRow>
      </StorySection>
    </StoryCanvas>
  ),
};
