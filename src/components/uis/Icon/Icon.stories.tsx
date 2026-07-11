import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';
import {Icon, iconList} from './Icon';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryRow,
  StorySection,
} from '../../../../.storybook/story-ui';
import {Typography} from '../Typography/Typography';
import type {IconName} from './Icon';

const commonIcons: IconName[] = [
  'MagnifyingGlass',
  'Bell',
  'Gear',
  'Plus',
  'Check',
  'X',
  'ArrowLeft',
  'ArrowRight',
  'Heart',
  'Warning',
  'Info',
  'Trash',
];

const meta = {
  title: 'Display/Icon',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component:
          'The shared glyph set for cpk-ui. Use a semantic icon name, inherit color from the surrounding control when possible, and pair standalone icons with accessible text.',
      },
    },
  },
  args: {
    name: 'MagnifyingGlass',
    size: 'medium',
  },
  argTypes: {
    name: {
      control: 'select',
      options: iconList,
      description: 'Name of the icon to display',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 16, 24, 32, 48],
      description:
        'Icon size: "small" (18px), "medium" (24px), "large" (32px), or custom number in pixels',
    },
    color: {
      description: 'Custom color for the icon',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};

export const CommonIcons: Story = {
  args: {},
  render: () => (
    <StoryCanvas>
      <StorySection label="Common actions">
        <StoryRow style={{alignItems: 'flex-start'}}>
          {commonIcons.map((name) => (
            <View key={name} style={{alignItems: 'center', gap: 6, width: 92}}>
              <Icon name={name} size="large" />
              <Typography.Body4 style={{textAlign: 'center'}}>
                {name}
              </Typography.Body4>
            </View>
          ))}
        </StoryRow>
      </StorySection>
      <StorySection label="Sizes">
        <StoryRow>
          <Icon name="Star" size="small" />
          <Icon name="Star" size="medium" />
          <Icon name="Star" size="large" />
          <Icon name="Star" size={48} />
        </StoryRow>
      </StorySection>
    </StoryCanvas>
  ),
};
