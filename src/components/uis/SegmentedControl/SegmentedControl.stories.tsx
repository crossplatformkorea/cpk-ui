import {useEffect, useState} from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryGrid,
  StoryHeader,
  StorySection,
  StorySpecimen,
  StoryStack,
  StorySurface,
  StoryText,
} from '../../../../.storybook/story-ui';
import {
  SegmentedControl,
  type SegmentedControlColorType,
  type SegmentedControlItem,
  type SegmentedControlProps,
  type SegmentedControlSizeType,
} from './SegmentedControl';
import {Typography} from '../Typography/Typography';

const releaseChannels: SegmentedControlItem[] = [
  {value: 'preview', text: 'Preview'},
  {value: 'beta', text: 'Beta'},
  {value: 'stable', text: 'Stable'},
];

type ReleaseChannel = 'preview' | 'beta' | 'stable';

const meta = {
  title: 'Inputs/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    docs: {
      description: {
        component:
          'A single-choice control for switching between closely related views or modes. Keep labels short, use two to four segments, and preserve the same content hierarchy between selections.',
      },
    },
  },
  args: {
    values: releaseChannels,
    selectedValue: 'beta',
    color: 'primary',
    size: 'medium',
    disabled: false,
    borderRadius: 6,
  },
  argTypes: {
    color: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
      ] satisfies SegmentedControlColorType[],
      description: 'Semantic color used for the selected segment',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 16, 20, 24, 32],
      description: 'Preset size or a custom numeric scale',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents changes for the entire control',
    },
    borderRadius: {
      control: {type: 'number', min: 0, max: 16, step: 1},
      description: 'Corner radius for the grouped control',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledControl(props: SegmentedControlProps) {
  const [selectedValue, setSelectedValue] = useState(props.selectedValue);

  useEffect(() => setSelectedValue(props.selectedValue), [props.selectedValue]);

  return (
    <StoryStack style={{maxWidth: 620}}>
      <SegmentedControl
        {...props}
        onValueChange={setSelectedValue}
        selectedValue={selectedValue}
      />
      <StoryText>Selected value: {String(selectedValue)}</StoryText>
    </StoryStack>
  );
}

function SizePreview({size}: {size: SegmentedControlSizeType}) {
  const [selectedValue, setSelectedValue] = useState('beta');

  return (
    <SegmentedControl
      borderRadius={6}
      onValueChange={(value) => setSelectedValue(String(value))}
      selectedValue={selectedValue}
      size={size}
      values={releaseChannels}
    />
  );
}

function ColorPreview({color}: {color: SegmentedControlColorType}) {
  const [selectedValue, setSelectedValue] = useState('beta');

  return (
    <SegmentedControl
      color={color}
      onValueChange={(value) => setSelectedValue(String(value))}
      selectedValue={selectedValue}
      size="small"
      values={releaseChannels}
    />
  );
}

export const Basic: Story = {
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="Use controls to compare size, color, radius, and disabled behavior. The selected value remains controlled."
        title="Release channel"
      />
      <StorySection label="Selection">
        <ControlledControl {...args} />
      </StorySection>
    </StoryCanvas>
  ),
};

export const ContentSwitching: Story = {
  args: {},
  render: () => {
    const [selectedValue, setSelectedValue] = useState<ReleaseChannel>('beta');
    const content: Record<
      ReleaseChannel,
      {title: string; description: string}
    > = {
      preview: {
        title: 'Preview builds',
        description: 'Generated for pull requests and internal review.',
      },
      beta: {
        title: 'Beta channel',
        description: 'Published for teams validating the next release.',
      },
      stable: {
        title: 'Stable channel',
        description: 'Recommended for production applications.',
      },
    };

    return (
      <StoryCanvas>
        <StoryHeader
          description="A segmented control changes one region without changing the page hierarchy."
          title="Channel settings"
        />
        <StorySection label="Distribution">
          <StoryStack style={{maxWidth: 620}}>
            <SegmentedControl
              onValueChange={(value) =>
                setSelectedValue(String(value) as ReleaseChannel)
              }
              selectedValue={selectedValue}
              values={releaseChannels}
            />
            <StorySurface>
              <Typography.Heading3>
                {content[selectedValue].title}
              </Typography.Heading3>
              <Typography.Body2>
                {content[selectedValue].description}
              </Typography.Body2>
            </StorySurface>
          </StoryStack>
        </StorySection>
      </StoryCanvas>
    );
  },
};

export const Sizes: Story = {
  args: {},
  render: () => (
    <StoryCanvas>
      <StoryHeader
        description="Preset sizes preserve the same interaction model while adapting touch target and text scale."
        title="Size scale"
      />
      <StoryGrid>
        {(['small', 'medium', 'large', 28] as const).map((size) => (
          <StorySpecimen
            key={String(size)}
            label={typeof size === 'number' ? 'Custom' : size}
            value={String(size)}
          >
            <View style={{width: '100%'}}>
              <SizePreview size={size} />
            </View>
          </StorySpecimen>
        ))}
      </StoryGrid>
    </StoryCanvas>
  ),
};

export const SemanticColors: Story = {
  args: {},
  render: () => (
    <StoryCanvas>
      <StoryHeader
        description="Semantic color changes emphasis only; labels and selection behavior remain consistent."
        title="Color roles"
      />
      <StoryGrid>
        {(
          [
            'primary',
            'secondary',
            'success',
            'info',
            'warning',
            'danger',
          ] as SegmentedControlColorType[]
        ).map((color) => (
          <StorySpecimen key={color} label={color}>
            <View style={{width: '100%'}}>
              <ColorPreview color={color} />
            </View>
          </StorySpecimen>
        ))}
      </StoryGrid>
    </StoryCanvas>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    selectedValue: 'stable',
  },
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="Use disabled only when the mode cannot currently change; preserve the selected value for context."
        title="Unavailable selection"
      />
      <StorySection label="Locked channel">
        <ControlledControl {...args} />
      </StorySection>
    </StoryCanvas>
  ),
};
