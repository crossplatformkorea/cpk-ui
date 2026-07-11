import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../.storybook/decorators';
import {
  StoryCanvas,
  StoryGrid,
  StoryHeader,
  StorySection,
  StorySpecimen,
} from '../../.storybook/story-ui';
import {useTheme} from '../providers/ThemeProvider';

function ColorFoundations() {
  const {theme} = useTheme();
  const roles = [
    ['Primary', theme.role.primary],
    ['Secondary', theme.role.secondary],
    ['Success', theme.role.success],
    ['Warning', theme.role.warning],
    ['Danger', theme.role.danger],
    ['Info', theme.role.info],
  ] as const;
  const surfaces = [
    ['Canvas', theme.bg.basic],
    ['Subtle surface', theme.bg.paper],
    ['Disabled', theme.bg.disabled],
    ['Border', theme.role.border],
  ] as const;

  return (
    <StoryCanvas>
      <StoryHeader
        description="Semantic color roles keep intent stable while values adapt to the active theme."
        title="Color foundations"
      />
      <StorySection
        description="Use role colors for state and emphasis, not as decoration."
        label="Semantic roles"
      >
        <StoryGrid>
          {roles.map(([label, value]) => (
            <StorySpecimen key={label} label={label} value={value}>
              <View
                style={{
                  backgroundColor: value,
                  borderColor: theme.role.border,
                  borderRadius: 4,
                  borderWidth: 1,
                  height: 52,
                  width: '100%',
                }}
              />
            </StorySpecimen>
          ))}
        </StoryGrid>
      </StorySection>
      <StorySection label="Surfaces">
        <StoryGrid>
          {surfaces.map(([label, value]) => (
            <StorySpecimen key={label} label={label} value={value}>
              <View
                style={{
                  backgroundColor: value,
                  borderColor: theme.role.border,
                  borderRadius: 4,
                  borderWidth: 1,
                  height: 52,
                  width: '100%',
                }}
              />
            </StorySpecimen>
          ))}
        </StoryGrid>
      </StorySection>
    </StoryCanvas>
  );
}

const meta = {
  title: 'Foundations/Colors',
  component: ColorFoundations,
  decorators: [withThemeProvider],
  parameters: {
    controls: {disable: true},
    docs: {
      description: {
        component:
          'The semantic palette used by cpk-ui components. Switch the global theme to verify both modes.',
      },
    },
  },
} satisfies Meta<typeof ColorFoundations>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Palette: Story = {};
