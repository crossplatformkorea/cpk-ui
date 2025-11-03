import type {ComponentProps} from 'react';
import {css} from 'kstyled';
import type {Meta, StoryObj} from '@storybook/react';
import {Accordion} from './Accordion';
import {withThemeProvider} from '../../../../.storybook/decorators';

const ACCORDION_DOCS = `
An expandable/collapsible accordion component for organizing content hierarchically.

## Features
- **Smooth Animations**: Configurable animation duration for expand/collapse
- **Flexible Sizing**: Preset sizes and custom numeric values
- **Collapse on Start**: Option to start with all items collapsed
- **Item Press Handling**: Callback for item interactions
- **Customizable Content**: Flexible data structure for titles and items
- **Animation Control**: Can disable animations if needed

## Size Options
- \`small\`: Compact accordion (title: 40px height, 14px font)
- \`medium\`: Standard accordion (title: 48px height, 16px font) - default
- \`large\`: Large accordion (title: 56px height, 18px font)
- Custom number: Custom size with proportional scaling

## Usage
\`\`\`tsx
<Accordion
  data={[
    {
      title: 'Section 1',
      items: ['Item 1', 'Item 2', 'Item 3'],
    },
    {
      title: 'Section 2',
      items: ['Item A', 'Item B', 'Item C'],
    },
  ]}
  size="medium"
  collapseOnStart={true}
  animDuration={200}
  shouldAnimate={true}
  onPressItem={(item) => console.log('Pressed:', item)}
/>
\`\`\`

## Props
- **size**: Accordion size ('small', 'medium', 'large', or number)
- **data**: Array of accordion sections with title and items
- **collapseOnStart**: Whether sections start collapsed
- **animDuration**: Animation duration in milliseconds
- **shouldAnimate**: Enable/disable animations
- **onPressItem**: Callback when an item is pressed
`;

const meta = {
  title: 'Accordion',
  component: Accordion,
  parameters: {
    notes: ACCORDION_DOCS,
    docs: {
      description: {
        component: ACCORDION_DOCS,
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 16, 20, 24],
      description: 'Accordion size: "small" (40px title), "medium" (48px title), "large" (56px title), or custom number',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    size: 'medium',
    animDuration: 200,
    collapseOnStart: true,
    onPressItem: () => {},
    data: [
      {
        title: 'Item 1',
        items: ['User', 'Mail', 'Text'],
      },
      {
        title: 'Item 2',
        items: ['User', 'Mail', 'Text'],
      },
      {
        title: 'Item 3',
        items: ['User', 'Mail', 'Text'],
      },
    ],
    shouldAnimate: true,
  },
  argTypes: {
    // @ts-expect-error - theme is for storybook control
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};
