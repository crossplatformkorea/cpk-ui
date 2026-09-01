import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryHeader,
  StorySection,
} from '../../../../.storybook/story-ui';
import {Typography} from '../Typography/Typography';
import {DonutChart} from './DonutChart';

const data = [
  {key: 'housing', label: 'Housing', value: 54, color: '#20C997'},
  {key: 'food', label: 'Food', value: 26, color: '#FF6B81'},
  {key: 'travel', label: 'Travel', value: 12, color: '#6EA8FE'},
  {key: 'other', label: 'Other', value: 8, color: '#F7C948'},
];

const meta = {
  title: 'Display/DonutChart',
  component: DonutChart,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'Responsive SVG donut chart with stable multi-segment gaps, an accessible summary, and a centered content slot.',
      },
    },
  },
} satisfies Meta<typeof DonutChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CategoryShare: Story = {
  args: {accessibilityLabel: 'Spending by category', data},
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="Segments remain legible when one category dominates the total."
        title="Spending composition"
      />
      <StorySection label="Current month">
        <DonutChart {...args}>
          <Typography.Heading4>$2,840</Typography.Heading4>
        </DonutChart>
      </StorySection>
    </StoryCanvas>
  ),
};

export const Empty: Story = {
  args: {
    accessibilityLabel: 'No category totals yet',
    data: [],
    emptyColor: '#DDE3EA',
  },
};
