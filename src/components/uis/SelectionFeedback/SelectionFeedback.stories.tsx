import React, {useState} from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {useTheme} from '../../../providers/ThemeProvider';
import {CustomPressable} from '../CustomPressable/CustomPressable';
import {Icon} from '../Icon/Icon';
import {Typography} from '../Typography/Typography';
import {SelectionFeedback} from './SelectionFeedback';

const meta = {
  title: 'Feedback/SelectionFeedback',
  component: SelectionFeedback,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'Wrap selection contents inside a stable press target. A changed identity grows 8% and settles; mount, unchanged selection and deselection stay still. Rapid changes cancel the prior pulse. System reduced motion is the default.',
      },
    },
  },
} satisfies Meta<typeof SelectionFeedback>;
export default meta;
type Story = StoryObj<typeof Choices>;

function Choices({
  reducedMotion,
}: {
  reducedMotion?: boolean;
}): React.ReactElement {
  const {theme} = useTheme();
  const [selected, setSelected] = useState(0);
  return (
    <View style={{gap: 20, padding: 24}}>
      <Typography.Body2>
        Choose, then rapidly choose another option.
      </Typography.Body2>
      <View style={{flexDirection: 'row', gap: 12}}>
        {[0, 1, 2].map((value) => (
          <CustomPressable
            accessibilityRole="radio"
            accessibilityLabel={`Option ${value + 1}`}
            accessibilityState={{checked: selected === value}}
            key={value}
            onPress={() => setSelected(value)}
            style={{padding: 8}}
          >
            <SelectionFeedback
              active={selected === value}
              selection={selected}
              reducedMotion={reducedMotion}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  selected === value ? theme.role.primary : theme.role.underlay,
              }}
            >
              <Icon
                name={selected === value ? 'CheckBold' : 'Circle'}
                color={
                  selected === value ? theme.text.contrast : theme.text.basic
                }
                size={20}
              />
            </SelectionFeedback>
          </CustomPressable>
        ))}
      </View>
    </View>
  );
}
export const Interactive: Story = {render: () => <Choices />};
export const ReducedMotion: Story = {render: () => <Choices reducedMotion />};
