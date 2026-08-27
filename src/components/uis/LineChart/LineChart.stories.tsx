import React from 'react';
import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryHeader,
  StorySection,
} from '../../../../.storybook/story-ui';
import {LineChart} from './LineChart';

const data = [
  {key: 'may', label: 'May', value: 12000},
  {key: 'jun', label: 'Jun', value: 6500},
  {key: 'jul', label: 'Jul', value: 9200},
  {key: 'aug', label: 'Aug', value: 9000},
  {key: 'sep', label: 'Sep', value: 7200},
  {key: 'oct', label: 'Oct', value: 11400},
  {key: 'nov', label: 'Nov', value: 16800},
  {key: 'dec', label: 'Dec', value: 20500},
];

const meta = {
  title: 'Display/LineChart',
  component: LineChart,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'Responsive native and web line chart with semantic theming, accessible point targets, selection, and an in-chart value tooltip.',
      },
    },
  },
} satisfies Meta<typeof LineChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Trend: Story = {
  args: {
    data,
    formatValue: (value) => `₩${value.toLocaleString()}`,
    onSelect: action('onSelect'),
    selectedKey: 'dec',
  },
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="Point targets occupy the full interval, while the visual marker remains compact."
        title="Monthly category trend"
      />
      <StorySection label="Twelve-month detail">
        <LineChart {...args} />
      </StorySection>
    </StoryCanvas>
  ),
};

export const Empty: Story = {
  args: {data: [], emptyLabel: 'No trend yet', variant: 'compact'},
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="The chart keeps its frame stable while data is unavailable."
        title="Empty trend"
      />
      <StorySection label="No observations">
        <LineChart {...args} />
      </StorySection>
    </StoryCanvas>
  ),
};
