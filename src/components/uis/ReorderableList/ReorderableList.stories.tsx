import React, {useState} from 'react';
import {View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import type {Meta, StoryObj} from '@storybook/react';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {useCPK} from '../../../providers';
import {Typography} from '../Typography/Typography';
import {ReorderableList} from './ReorderableList';

const keyExtractor = (item: {id: string}): string => item.id;
const getItemLabel = (item: {name: string}): string => item.name;
function Example({
  disabled = false,
  count = 12,
}: {
  disabled?: boolean;
  count?: number;
}) {
  const {theme} = useCPK();
  const [data, setData] = useState(() =>
    Array.from({length: count}, (_, index) => ({
      id: String(index),
      name:
        index === 1
          ? 'A very long item title that wraps onto two lines and ends with an ellipsis instead of displacing the handle'
          : `Item ${index + 1}`,
    })),
  );
  return (
    <GestureHandlerRootView
      style={{
        height: 600,
        width: '100%',
        maxWidth: 720,
        padding: 20,
        backgroundColor: theme.bg.basic,
      }}
    >
      <ReorderableList
        data={data}
        disabled={disabled}
        keyExtractor={keyExtractor}
        getItemLabel={getItemLabel}
        onReorder={setData}
        renderItem={({item, dragHandle}) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 16,
              marginBottom: 8,
              borderWidth: 1,
              borderRadius: 20,
              borderColor: theme.role.border,
              backgroundColor: theme.bg.paper,
            }}
          >
            <Typography.Body2
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{flex: 1, minWidth: 0}}
            >
              {item.name}
            </Typography.Body2>
            {dragHandle}
          </View>
        )}
      />
    </GestureHandlerRootView>
  );
}
const meta = {
  title: 'Display/ReorderableList',
  component: Example,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'Virtualized handle-only drag/drop with variable-height rows, autoscroll and reduced-motion support. Update the controlled data on drop. Test long names, disabled state and moving items beyond the first viewport.',
      },
    },
  },
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
export const LongList: Story = {args: {count: 120}};
export const Empty: Story = {args: {count: 0}};
