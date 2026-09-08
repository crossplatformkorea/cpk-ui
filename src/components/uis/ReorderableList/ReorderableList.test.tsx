import React, {type ReactNode} from 'react';
import {Platform, View, type ViewProps} from 'react-native';
import {SortableItem} from 'react-native-drax';
import {fireEvent, render} from '@testing-library/react-native';
import {FlashList} from '@shopify/flash-list';
import {createComponent} from '../../../../test/testUtils';
import {Typography} from '../Typography/Typography';
import {ReorderableList} from './ReorderableList';

jest.mock('react-native-drax', () => {
  const {View: MockView} =
    jest.requireActual<typeof import('react-native')>('react-native');
  return {
    DraxProvider: MockView,
    DraxHandle: MockView,
    SortableContainer: MockView,
    SortableItem: (props: ViewProps) => <MockView {...props} />,
    useSortableList: ({data}: {data: unknown[]}) => ({data}),
  };
});
jest.mock('@shopify/flash-list', () => {
  const {View} =
    jest.requireActual<typeof import('react-native')>('react-native');
  return {
    FlashList: jest.fn(
      ({
        data,
        renderItem,
        testID,
      }: {
        data: unknown[];
        renderItem: (info: {item: unknown; index: number}) => ReactNode;
        testID: string;
      }) => (
        <View testID={testID}>
          {data.map((item, index) => (
            <View key={index}>{renderItem({item, index})}</View>
          ))}
        </View>
      ),
    ),
  };
});

const data = [
  {id: 'a', name: 'Alpha'},
  {id: 'b', name: 'Beta'},
  {id: 'c', name: 'Gamma'},
];
const keyExtractor = (item: (typeof data)[number]): string => item.id;
function example(onReorder = jest.fn(), disabled = false) {
  return (
    <ReorderableList
      data={data}
      keyExtractor={keyExtractor}
      getItemLabel={(item) => item.name}
      onReorder={onReorder}
      disabled={disabled}
      renderItem={({item, dragHandle}) => (
        <View>
          <Typography.Body2>{item.name}</Typography.Body2>
          {dragHandle}
        </View>
      )}
    />
  );
}

describe('ReorderableList contract (gesture engine covered separately)', () => {
  it('keeps the viewport stable when the accepted row order changes', () => {
    render(createComponent(example()));
    expect(jest.mocked(FlashList).mock.calls.at(-1)?.[0]).toEqual(
      expect.objectContaining({
        maintainVisibleContentPosition: {disabled: true},
      }),
    );
  });
  it.each(['light', 'dark'] as const)(
    'keeps labelled 48pt handles in %s',
    (theme) => {
      const screen = render(createComponent(example(), theme));
      const handle = screen.getByTestId('reorderable-list-handle-b');
      expect(handle).toHaveProp('accessibilityLabel', 'Beta');
      expect(handle).toHaveStyle({width: 48, minHeight: 48});
    },
  );
  it('reorders through assistive actions without mutating caller data', () => {
    const onReorder = jest.fn();
    const screen = render(createComponent(example(onReorder)));
    fireEvent(
      screen.getByTestId('reorderable-list-handle-b'),
      'accessibilityAction',
      {nativeEvent: {actionName: 'decrement'}},
    );
    expect(onReorder).toHaveBeenCalledWith([data[1], data[0], data[2]]);
    expect(data.map((item) => item.id)).toEqual(['a', 'b', 'c']);
  });
  it('ignores boundary and unrelated accessibility actions', () => {
    const onReorder = jest.fn();
    const screen = render(createComponent(example(onReorder)));
    fireEvent(
      screen.getByTestId('reorderable-list-handle-a'),
      'accessibilityAction',
      {nativeEvent: {actionName: 'decrement'}},
    );
    fireEvent(
      screen.getByTestId('reorderable-list-handle-c'),
      'accessibilityAction',
      {nativeEvent: {actionName: 'increment'}},
    );
    expect(onReorder).not.toHaveBeenCalled();
  });
  it('keeps content without draggable controls when disabled', () => {
    const screen = render(createComponent(example(jest.fn(), true)));
    expect(screen.getByText('Alpha')).toBeTruthy();
    expect(screen.queryByTestId('reorderable-list-handle-a')).toBeNull();
  });
  it('does not expose a second adjustable control on the row wrapper', () => {
    const screen = render(createComponent(example()));
    for (const row of screen.UNSAFE_getAllByType(SortableItem)) {
      expect(row.props.accessibilityRole).not.toBe('adjustable');
    }
  });
  it('passes the actual index to a position-aware key extractor', () => {
    const onReorder = jest.fn();
    const screen = render(
      createComponent(
        <ReorderableList
          data={data}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          getItemLabel={(item) => item.name}
          onReorder={onReorder}
          renderItem={({dragHandle}) => <View>{dragHandle}</View>}
        />,
      ),
    );
    fireEvent(
      screen.getByTestId('reorderable-list-handle-b-1'),
      'accessibilityAction',
      {nativeEvent: {actionName: 'decrement'}},
    );
    expect(onReorder).toHaveBeenCalledWith([data[1], data[0], data[2]]);
  });
  it('supports arrow-key reordering on web without scrolling the page', () => {
    const original = Platform.OS;
    Platform.OS = 'web';
    try {
      const onReorder = jest.fn();
      const preventDefault = jest.fn();
      const screen = render(createComponent(example(onReorder)));
      fireEvent(screen.getByTestId('reorderable-list-handle-b'), 'keyDown', {
        key: 'ArrowUp',
        preventDefault,
      });
      expect(onReorder).toHaveBeenCalledWith([data[1], data[0], data[2]]);
      expect(preventDefault).toHaveBeenCalledTimes(1);
    } finally {
      Platform.OS = original;
    }
  });
});
