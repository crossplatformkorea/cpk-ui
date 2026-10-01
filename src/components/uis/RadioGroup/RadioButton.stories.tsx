import React, {useState} from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {RadioButton} from './RadioButton';

const meta = {
  title: 'Inputs/RadioButton',
  component: RadioButton,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'Stable choice target with a brief pop on the newly selected mark. Initial selection, deselection and reduced motion stay still.',
      },
    },
  },
} satisfies Meta<typeof RadioButton>;
export default meta;
type Story = StoryObj<typeof RadioButton>;
function Choices(): React.ReactElement {
  const [selected, setSelected] = useState(0);
  return (
    <View style={{gap: 20, padding: 24}}>
      {[0, 1, 2].map((value) => (
        <RadioButton
          key={value}
          label={`Option ${value + 1}`}
          selected={value === selected}
          onPress={() => setSelected(value)}
        />
      ))}
    </View>
  );
}
export const SelectionMotion: Story = {render: () => <Choices />};
export const Disabled: Story = {
  args: {selected: true, disabled: true, label: 'Unavailable option'},
};
export const Instant: Story = {
  args: {selected: true, selectionAnimation: false, label: 'Instant selection'},
};
