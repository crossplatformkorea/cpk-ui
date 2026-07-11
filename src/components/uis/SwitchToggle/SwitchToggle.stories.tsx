import React, {useEffect, useState, type ComponentProps} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {SwitchToggle} from './SwitchToggle';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryRow,
  StorySection,
  StoryStack,
  StoryText,
} from '../../../../.storybook/story-ui';

function InteractiveSwitch(props: ComponentProps<typeof SwitchToggle>) {
  const [isOn, setIsOn] = useState(props.isOn);

  useEffect(() => setIsOn(props.isOn), [props.isOn]);

  return (
    <StoryStack style={{alignItems: 'center'}}>
      <SwitchToggle
        {...props}
        isOn={isOn}
        onPress={() => {
          setIsOn((value) => !value);
          props.onPress?.();
        }}
      />
      <StoryText>{isOn ? 'Enabled' : 'Disabled'}</StoryText>
    </StoryStack>
  );
}

function TogglePreview({
  initialValue = false,
  size,
}: {
  initialValue?: boolean;
  size: 'small' | 'medium' | 'large' | number;
}) {
  const [isOn, setIsOn] = useState(initialValue);

  return (
    <StoryStack style={{alignItems: 'center'}}>
      <SwitchToggle
        accessibilityLabel={`Toggle ${String(size)}`}
        isOn={isOn}
        onPress={() => setIsOn((value) => !value)}
        size={size}
      />
      <StoryText>{isOn ? 'On' : 'Off'}</StoryText>
    </StoryStack>
  );
}

const meta = {
  title: 'Inputs/SwitchToggle',
  component: SwitchToggle,
  parameters: {
    docs: {
      description: {
        component:
          'A binary setting control with animated on and off states. Apply changes immediately on press; use Checkbox instead when users should submit several selections together.',
      },
    },
  },
  args: {
    accessibilityLabel: 'Notifications',
    isOn: false,
    size: 'medium',
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 24, 30, 36, 42],
      description:
        'Switch size: "small" (24px), "medium" (30px), "large" (36px), or custom number with proportional scaling',
    },
    isOn: {
      description: 'Whether the switch is in the on position',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof SwitchToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
  render: (args) => <InteractiveSwitch {...args} />,
};

export const SizesAndStates: Story = {
  args: {},
  render: () => (
    <StoryCanvas>
      <StorySection label="Interactive sizes">
        <StoryRow style={{alignItems: 'flex-start'}}>
          <TogglePreview size="small" />
          <TogglePreview initialValue size="medium" />
          <TogglePreview size="large" />
          <TogglePreview initialValue size={48} />
        </StoryRow>
      </StorySection>
    </StoryCanvas>
  ),
};
