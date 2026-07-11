import React, {useState} from 'react';
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

import {Rating} from './Rating';

function InteractiveRating() {
  const [score, setScore] = useState(3.5);

  return (
    <StoryStack>
      <Rating initialRating={score} onRatingUpdate={setScore} size="large" />
      <StoryText>{score.toFixed(1)} out of 5</StoryText>
    </StoryStack>
  );
}

const meta = {
  title: 'Inputs/Rating',
  component: Rating,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'A selectable score input with whole or half steps, horizontal or vertical layout, and a disabled read-only state.',
      },
    },
  },
  args: {
    allowHalfRating: true,
    initialRating: 3.5,
    onRatingUpdate: action('onRatingUpdate'),
    size: 'medium',
  },
  argTypes: {
    direction: {control: 'radio', options: ['horizontal', 'vertical']},
    iconType: {control: 'radio', options: ['star', 'dooboo']},
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 40],
    },
  },
} satisfies Meta<typeof Rating>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Interactive: Story = {
  render: () => <InteractiveRating />,
};

export const Variants: Story = {
  render: () => (
    <StoryCanvas>
      <StorySection label="Sizes">
        <StoryStack>
          <Rating initialRating={2.5} size="small" />
          <Rating initialRating={3} size="medium" />
          <Rating initialRating={4.5} size="large" />
          <Rating initialRating={4} size={40} />
        </StoryStack>
      </StorySection>
      <StorySection label="Modes">
        <StoryRow style={{alignItems: 'flex-start'}}>
          <Rating allowHalfRating={false} initialRating={3} />
          <Rating iconType="dooboo" initialRating={2.5} />
          <Rating disabled initialRating={4} />
        </StoryRow>
      </StorySection>
    </StoryCanvas>
  ),
};
