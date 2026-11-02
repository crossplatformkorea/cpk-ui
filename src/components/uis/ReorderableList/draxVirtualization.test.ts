import {act, renderHook} from '@testing-library/react-native';
import {useSortableList} from '../../../../node_modules/react-native-drax/src/hooks/useSortableList';

// Keep the real sorting/geometry hook; only UI-thread transport is synchronous.
jest.mock('react-native-reanimated', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {useSharedValue: <T>(value: T) => React.useRef({value}).current};
});

jest.mock('react-native-worklets', () => ({
  runOnUI: <Args extends unknown[], Result>(
    callback: (...args: Args) => Result,
  ) => callback,
}));

const data = Array.from({length: 120}, (_, index) => ({id: String(index)}));
const keyExtractor = (item: (typeof data)[number]): string => item.id;

function setup(first: number, horizontal = false) {
  const {result} = renderHook(() =>
    useSortableList({data, keyExtractor, onReorder: jest.fn(), horizontal}),
  );
  const state = result.current._internal;
  // Only three rows are mounted; all 117 unseen rows intentionally lack layout.
  for (let index = first; index < first + 3; index++) {
    state.itemMeasurements.current.set(String(index), {
      key: String(index),
      index,
      x: horizontal ? index * 90 : 0,
      y: horizontal ? 0 : index * 90,
      width: horizontal ? 80 : 300,
      height: horizontal ? 300 : 80,
      scrollAtMeasure: {x: 0, y: 0},
    });
  }
  state.initPendingOrder();
  state.draggedDisplayIndexRef.current = first;
  return state;
}

describe('Drax virtualized single-column geometry', () => {
  it('commits accepted order to real cells so resizing and hit targets stay aligned', () => {
    const {result, rerender} = renderHook(
      ({rows}: {rows: typeof data}) =>
        useSortableList({data: rows, keyExtractor, onReorder: jest.fn()}),
      {initialProps: {rows: data}},
    );
    const ordered = [data[1], data[0], ...data.slice(2)];
    result.current._internal.pendingOrderRef.current = [
      1,
      0,
      ...data.slice(2).map((_, index) => index + 2),
    ];
    result.current._internal.commitVisualOrder();
    result.current._internal.shiftsRef.value = {'0': {x: 0, y: 90}};
    act(() => rerender({rows: ordered}));
    expect(result.current.data).toEqual(ordered);
    expect(result.current._internal.shiftsRef.value).toEqual({});
  });
  it.each([0, 40])(
    'finds visible drop slots without requiring unseen rows at %s',
    (first) => {
      const state = setup(first);
      expect(state.getSlotFromPosition({x: 20, y: (first + 2) * 90 + 40})).toBe(
        first + 2,
      );
      expect(state.getSlotFromPosition({x: 20, y: first * 90 + 10})).toBe(
        first,
      );
    },
  );
  it('computes only changed-row shifts with unmounted rows on both sides', () => {
    const state = setup(40);
    const order = data.map((_, index) => index);
    order.splice(40, 3, 41, 42, 40);
    expect(state.computeShiftsForOrder(order)).toEqual({
      '40': {x: 0, y: 180},
      '41': {x: 0, y: -90},
      '42': {x: 0, y: -90},
    });
    expect(state.computeShiftsForOrder(order, 42)).toEqual({
      '41': {x: 0, y: -90},
      '42': {x: 0, y: -90},
    });
    expect(state.computeShiftsForOrder(data.map((_, index) => index))).toEqual(
      {},
    );
  });
  it('handles horizontal geometry without guessing unmeasured heights', () => {
    const state = setup(40, true);
    expect(state.getSlotFromPosition({x: 42 * 90 + 40, y: 0})).toBe(42);
    const order = data.map((_, index) => index);
    order.splice(40, 3, 41, 42, 40);
    expect(state.computeShiftsForOrder(order)?.['40']).toEqual({x: 180, y: 0});
    state.itemMeasurements.current.delete('41');
    expect(state.computeShiftsForOrder(order)).toBeUndefined();
  });
  it('preserves measured variable heights within the changed range', () => {
    const state = setup(40);
    const middle = state.itemMeasurements.current.get('41');
    const last = state.itemMeasurements.current.get('42');
    if (!middle || !last) throw new Error('missing fixture');
    state.itemMeasurements.current.set('41', {...middle, height: 140});
    state.itemMeasurements.current.set('42', {...last, y: last.y + 60});
    const order = data.map((_, index) => index);
    order.splice(40, 3, 41, 42, 40);
    expect(state.computeShiftsForOrder(order)).toEqual({
      '40': {x: 0, y: 240},
      '41': {x: 0, y: -90},
      '42': {x: 0, y: -90},
    });
  });
});
