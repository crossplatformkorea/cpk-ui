import type {ComponentProps} from 'react';
import {css} from 'kstyled';
import type {Meta, StoryObj} from '@storybook/react';
import {Accordion} from './Accordion';
import {withThemeProvider} from '../../../../.storybook/decorators';

const ACCORDION_DOCS =
  'Groups related sections behind disclosure controls. Use defaultExpandedIndexes for intentional initial disclosure; avoid expanding every section when the content is long.';

const meta = {
  title: 'Display/Accordion',
  component: Accordion,
  parameters: {
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
      description:
        'Accordion size: "small" (40px title), "medium" (48px title), "large" (56px title), or custom number',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultData = [
  {
    title: 'Installation',
    items: ['Package manager', 'Peer dependencies', 'Provider setup'],
  },
  {
    title: 'Theming',
    items: ['Color roles', 'Light and dark modes', 'Custom tokens'],
  },
  {
    title: 'Platform behavior',
    items: ['iOS', 'Android', 'Web'],
  },
];

export const Basic: Story = {
  args: {
    size: 'medium',
    animDuration: 200,
    collapseOnStart: true,
    onPressItem: () => {},
    data: defaultData,
    shouldAnimate: true,
  },
};

export const FirstItemExpanded: Story = {
  args: {
    size: 'medium',
    animDuration: 200,
    defaultExpandedIndexes: [0],
    onPressItem: () => {},
    data: defaultData,
    shouldAnimate: true,
  },
};

export const MultipleItemsExpanded: Story = {
  args: {
    size: 'medium',
    animDuration: 200,
    defaultExpandedIndexes: [0, 2],
    onPressItem: () => {},
    data: defaultData,
    shouldAnimate: true,
  },
};

export const AllItemsExpanded: Story = {
  args: {
    size: 'medium',
    animDuration: 200,
    expandAllOnStart: true,
    onPressItem: () => {},
    data: defaultData,
    shouldAnimate: true,
  },
};
