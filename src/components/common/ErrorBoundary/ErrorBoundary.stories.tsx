import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StorySection,
  StorySurface,
  StoryText,
} from '../../../../.storybook/story-ui';
import {ErrorBoundary} from './ErrorBoundary';

class FailedBoundaryPreview extends ErrorBoundary {
  constructor(props: React.ComponentProps<typeof ErrorBoundary>) {
    super(props);
    this.state = {
      error: new Error('Preview failure'),
      hasError: true,
    };
  }
}

function BoundaryPreview({customFallback}: {customFallback?: boolean}) {
  return (
    <StoryCanvas>
      <StorySection
        label={customFallback ? 'Custom fallback' : 'Default fallback'}
      >
        <FailedBoundaryPreview
          fallback={
            customFallback ? (
              <StorySurface>
                <StoryText>Custom recovery content</StoryText>
              </StorySurface>
            ) : undefined
          }
        >
          <StoryText>Child content</StoryText>
        </FailedBoundaryPreview>
      </StorySection>
    </StoryCanvas>
  );
}

function HealthyBoundaryPreview() {
  return (
    <StoryCanvas>
      <StorySection label="Healthy subtree">
        <ErrorBoundary>
          <StorySurface>
            <StoryText>Child content is rendering normally.</StoryText>
          </StorySurface>
        </ErrorBoundary>
      </StorySection>
    </StoryCanvas>
  );
}

const meta = {
  title: 'Feedback/ErrorBoundary',
  component: ErrorBoundary,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'Catches rendering errors below the boundary and replaces the failed subtree with a default or custom fallback. Remount the boundary to retry the original content.',
      },
    },
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Healthy: Story = {
  render: () => <HealthyBoundaryPreview />,
};

export const DefaultFallback: Story = {
  render: () => <BoundaryPreview />,
};

export const CustomFallback: Story = {
  render: () => <BoundaryPreview customFallback />,
};
