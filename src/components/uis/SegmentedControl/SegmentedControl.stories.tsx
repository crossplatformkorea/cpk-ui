import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {View} from 'react-native';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {SegmentedControl, SegmentedControlColorType, SegmentedControlSizeType} from './SegmentedControl';
import {Typography} from '../Typography/Typography';

const meta = {
  title: 'SegmentedControl',
  component: (props) => <SegmentedControl {...props} />,
  parameters: {
    notes: `
A iOS-style SegmentedControl component that allows users to select a single option from a set of choices.

## Features
- **iOS-style Design**: Native iOS segmented control appearance
- **Flexible Sizing**: Supports preset sizes (small, medium, large) and custom numeric values
- **Color Variants**: Multiple color options for different contexts
- **Disabled State**: Can disable the entire control
- **Smooth Transitions**: Animated selection with visual feedback

## Size Options
- \`small\`: 6px/8px padding
- \`medium\`: 8px/12px padding (default)
- \`large\`: 12px/16px padding
- Custom number: Any pixel value for custom padding

## Usage
\`\`\`tsx
<SegmentedControl
  data={['Day', 'Week', 'Month']}
  labels={['Day', 'Week', 'Month']}
  selectedValue="Day"
  onValueChange={setSelectedValue}
  size="medium"
  color="primary"
/>
\`\`\`
        `,
    docs: {
      description: {
        component: `
A iOS-style SegmentedControl component that allows users to select a single option from a set of choices.

## Features
- **iOS-style Design**: Native iOS segmented control appearance
- **Flexible Sizing**: Supports preset sizes (small, medium, large) and custom numeric values
- **Color Variants**: Multiple color options for different contexts
- **Disabled State**: Can disable the entire control
- **Smooth Transitions**: Animated selection with visual feedback

## Size Options
- \`small\`: 6px/8px padding
- \`medium\`: 8px/12px padding (default)
- \`large\`: 12px/16px padding
- Custom number: Any pixel value for custom padding

## Usage
\`\`\`tsx
<SegmentedControl
  data={['Day', 'Week', 'Month']}
  labels={['Day', 'Week', 'Month']}
  selectedValue="Day"
  onValueChange={setSelectedValue}
  size="medium"
  color="primary"
/>
\`\`\`
        `,
      },
    },
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
      ] as SegmentedControlColorType[],
      description: 'Color variant of the selected segment',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 16, 20, 24, 32],
      description: 'Size can be "small", "medium", "large" or a custom number in pixels',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the entire segmented control',
    },
    borderRadius: {
      control: {type: 'number', min: 0, max: 20, step: 1},
      description: 'Border radius of the control',
    },
  },
  decorators: [
    (Story, context) =>
      withThemeProvider(
        Story,
        context,
        // @ts-ignore
        context.args.theme,
      ),
  ],
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState<string | number>('day');

    return (
      <View style={{gap: 20}}>
        <SegmentedControl
          values={[
            {value: 'day', text: 'Day'},
            {value: 'week', text: 'Week'},
            {value: 'month', text: 'Month'},
          ]}
          color={args.color}
          size={args.size}
          disabled={args.disabled}
          borderRadius={args.borderRadius}
          selectedValue={selectedValue}
          onValueChange={setSelectedValue}
        />
        <View style={{padding: 16, alignItems: 'center'}}>
          <Typography.Heading2>Selected: {selectedValue}</Typography.Heading2>
        </View>
      </View>
    );
  },
  args: {
    theme: 'light',
    color: 'primary',
    size: 'medium',
    disabled: false,
    borderRadius: 8,
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export const WithDynamicContent: Story = {
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState<string | number>('day');

    const contentMap = {
      day: {
        title: 'Daily View',
        description: 'View your daily activities and statistics',
        emoji: '📅',
      },
      week: {
        title: 'Weekly View',
        description: 'See your weekly progress and trends',
        emoji: '📊',
      },
      month: {
        title: 'Monthly View',
        description: 'Analyze your monthly performance',
        emoji: '📈',
      },
    };

    const content = contentMap[selectedValue as keyof typeof contentMap];

    return (
      <View style={{gap: 20}}>
        <SegmentedControl
          values={[
            {value: 'day', text: 'Day'},
            {value: 'week', text: 'Week'},
            {value: 'month', text: 'Month'},
          ]}
          color={args.color}
          size={args.size}
          disabled={args.disabled}
          borderRadius={args.borderRadius}
          selectedValue={selectedValue}
          onValueChange={setSelectedValue}
        />
        <View style={{padding: 24, alignItems: 'center', gap: 12}}>
          <Typography.Heading1 style={{fontSize: 48}}>
            {content.emoji}
          </Typography.Heading1>
          <Typography.Heading2>{content.title}</Typography.Heading2>
          <Typography.Body1 style={{textAlign: 'center', opacity: 0.7}}>
            {content.description}
          </Typography.Body1>
        </View>
      </View>
    );
  },
  args: {
    theme: 'light',
    color: 'primary',
    size: 'medium',
    disabled: false,
    borderRadius: 8,
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export const PlatformSelector: Story = {
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState<string | number>('ios');

    const platformInfo = {
      ios: {
        icon: '🍎',
        name: 'iOS',
        version: 'iOS 17+',
        features: ['Swift', 'SwiftUI', 'UIKit'],
      },
      android: {
        icon: '🤖',
        name: 'Android',
        version: 'Android 14+',
        features: ['Kotlin', 'Jetpack Compose', 'Material Design'],
      },
      web: {
        icon: '🌐',
        name: 'Web',
        version: 'Modern Browsers',
        features: ['React', 'TypeScript', 'Responsive Design'],
      },
    };

    const info = platformInfo[selectedValue as keyof typeof platformInfo];

    return (
      <View style={{gap: 20}}>
        <SegmentedControl
          values={[
            {value: 'ios', text: 'iOS'},
            {value: 'android', text: 'Android'},
            {value: 'web', text: 'Web'},
          ]}
          color={args.color}
          size={args.size}
          disabled={args.disabled}
          borderRadius={args.borderRadius}
          selectedValue={selectedValue}
          onValueChange={setSelectedValue}
        />
        <View style={{padding: 24, gap: 16}}>
          <View style={{alignItems: 'center', gap: 8}}>
            <Typography.Heading1 style={{fontSize: 56}}>
              {info.icon}
            </Typography.Heading1>
            <Typography.Heading2>{info.name}</Typography.Heading2>
            <Typography.Body2 style={{opacity: 0.6}}>
              {info.version}
            </Typography.Body2>
          </View>
          <View style={{gap: 8, marginTop: 8}}>
            <Typography.Heading3>Key Technologies:</Typography.Heading3>
            {info.features.map((feature) => (
              <Typography.Body1 key={feature} style={{paddingLeft: 12}}>
                • {feature}
              </Typography.Body1>
            ))}
          </View>
        </View>
      </View>
    );
  },
  args: {
    theme: 'light',
    color: 'primary',
    size: 'medium',
    disabled: false,
    borderRadius: 8,
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export const AllSizes: Story = {
  render: (args) => {
    const [selectedSmall, setSelectedSmall] = useState<string | number>('day');
    const [selectedMedium, setSelectedMedium] = useState<string | number>('day');
    const [selectedLarge, setSelectedLarge] = useState<string | number>('day');

    const values = [
      {value: 'day', text: 'Day'},
      {value: 'week', text: 'Week'},
      {value: 'month', text: 'Month'},
    ];

    return (
      <View style={{gap: 24}}>
        <View style={{gap: 8}}>
          <Typography.Heading3>Small</Typography.Heading3>
          <SegmentedControl
            values={values}
            color="primary"
            size="small"
            borderRadius={8}
            selectedValue={selectedSmall}
            onValueChange={setSelectedSmall}
          />
        </View>
        <View style={{gap: 8}}>
          <Typography.Heading3>Medium</Typography.Heading3>
          <SegmentedControl
            values={values}
            color="primary"
            size="medium"
            borderRadius={8}
            selectedValue={selectedMedium}
            onValueChange={setSelectedMedium}
          />
        </View>
        <View style={{gap: 8}}>
          <Typography.Heading3>Large</Typography.Heading3>
          <SegmentedControl
            values={values}
            color="primary"
            size="large"
            borderRadius={8}
            selectedValue={selectedLarge}
            onValueChange={setSelectedLarge}
          />
        </View>
      </View>
    );
  },
  args: {
    theme: 'light',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export const AllColors: Story = {
  render: (args) => {
    const [selected1, setSelected1] = useState<string | number>(1);
    const [selected2, setSelected2] = useState<string | number>(1);
    const [selected3, setSelected3] = useState<string | number>(1);
    const [selected4, setSelected4] = useState<string | number>(1);
    const [selected5, setSelected5] = useState<string | number>(1);
    const [selected6, setSelected6] = useState<string | number>(1);

    const values = [
      {value: 1, text: 'Option 1'},
      {value: 2, text: 'Option 2'},
      {value: 3, text: 'Option 3'},
    ];

    return (
      <View style={{gap: 20}}>
        <View style={{gap: 8}}>
          <Typography.Heading3>Primary</Typography.Heading3>
          <SegmentedControl
            values={values}
            color="primary"
            size="medium"
            borderRadius={8}
            selectedValue={selected1}
            onValueChange={setSelected1}
          />
        </View>
        <View style={{gap: 8}}>
          <Typography.Heading3>Secondary</Typography.Heading3>
          <SegmentedControl
            values={values}
            color="secondary"
            size="medium"
            borderRadius={8}
            selectedValue={selected2}
            onValueChange={setSelected2}
          />
        </View>
        <View style={{gap: 8}}>
          <Typography.Heading3>Success</Typography.Heading3>
          <SegmentedControl
            values={values}
            color="success"
            size="medium"
            borderRadius={8}
            selectedValue={selected3}
            onValueChange={setSelected3}
          />
        </View>
        <View style={{gap: 8}}>
          <Typography.Heading3>Danger</Typography.Heading3>
          <SegmentedControl
            values={values}
            color="danger"
            size="medium"
            borderRadius={8}
            selectedValue={selected4}
            onValueChange={setSelected4}
          />
        </View>
        <View style={{gap: 8}}>
          <Typography.Heading3>Warning</Typography.Heading3>
          <SegmentedControl
            values={values}
            color="warning"
            size="medium"
            borderRadius={8}
            selectedValue={selected5}
            onValueChange={setSelected5}
          />
        </View>
        <View style={{gap: 8}}>
          <Typography.Heading3>Info</Typography.Heading3>
          <SegmentedControl
            values={values}
            color="info"
            size="medium"
            borderRadius={8}
            selectedValue={selected6}
            onValueChange={setSelected6}
          />
        </View>
      </View>
    );
  },
  args: {
    theme: 'light',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export const WithIcons: Story = {
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState<string | number>('list');

    return (
      <View style={{gap: 20}}>
        <SegmentedControl
          values={[
            {value: 'grid', text: <Typography.Body2>📱 Grid</Typography.Body2>},
            {value: 'list', text: <Typography.Body2>📋 List</Typography.Body2>},
            {value: 'map', text: <Typography.Body2>🗺️ Map</Typography.Body2>},
          ]}
          color={args.color}
          size={args.size}
          disabled={args.disabled}
          borderRadius={args.borderRadius}
          selectedValue={selectedValue}
          onValueChange={setSelectedValue}
        />
        <View style={{padding: 16, alignItems: 'center'}}>
          <Typography.Body1>View mode: {selectedValue}</Typography.Body1>
        </View>
      </View>
    );
  },
  args: {
    theme: 'light',
    color: 'primary',
    size: 'medium',
    disabled: false,
    borderRadius: 8,
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState<string | number>('second');

    return (
      <View style={{gap: 20}}>
        <SegmentedControl
          values={[
            {value: 'first', text: 'First'},
            {value: 'second', text: 'Second'},
            {value: 'third', text: 'Third'},
          ]}
          color={args.color}
          size={args.size}
          disabled={args.disabled}
          borderRadius={args.borderRadius}
          selectedValue={selectedValue}
          onValueChange={setSelectedValue}
        />
        <View style={{padding: 16, alignItems: 'center'}}>
          <Typography.Body1 style={{opacity: 0.5}}>
            This control is disabled
          </Typography.Body1>
        </View>
      </View>
    );
  },
  args: {
    theme: 'light',
    color: 'primary',
    size: 'medium',
    disabled: true,
    borderRadius: 8,
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};
