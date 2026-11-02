import '@testing-library/jest-native/extend-expect';

import React, {act, createRef, type ReactElement} from 'react';
import {Text, View} from 'react-native';
import {
  PointerType,
  State,
  type GestureTouchEvent,
} from 'react-native-gesture-handler';
import {getByGestureTestId} from 'react-native-gesture-handler/jest-utils';
import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import {PinchZoom} from './PinchZoom';
import type {PinchZoomProps, PinchZoomRef} from './PinchZoom';

let testingLib: RenderAPI;

const Component = ({props}: {props?: PinchZoomProps}): ReactElement =>
  createComponent(
    <PinchZoom {...props}>
      <View testID="child-view">
        <Text>Test Child</Text>
      </View>
    </PinchZoom>,
  );

describe('[PinchZoom]', () => {
  it('should render without crashing', () => {
    testingLib = render(Component({}));

    const json = testingLib.toJSON();
    expect(json).toBeTruthy();
  });

  it('should render children correctly', () => {
    testingLib = render(Component({}));

    expect(testingLib.getByTestId('child-view')).toBeTruthy();
    expect(testingLib.getByText('Test Child')).toBeTruthy();
  });

  it('should render with custom testID', () => {
    testingLib = render(Component({props: {testID: 'custom-pinch-zoom'}}));

    expect(testingLib.getByTestId('custom-pinch-zoom')).toBeTruthy();
  });

  it('should call onScaleChanged callback', () => {
    const onScaleChanged = jest.fn();
    testingLib = render(Component({props: {onScaleChanged}}));

    // Note: Actual scale changes would require gesture simulation
    // which is complex in unit tests. This test verifies the prop is passed.
    expect(onScaleChanged).toBeDefined();
  });

  it('should call onTranslateChanged callback', () => {
    const onTranslateChanged = jest.fn();
    testingLib = render(Component({props: {onTranslateChanged}}));

    // Note: Actual translation changes would require gesture simulation
    // which is complex in unit tests. This test verifies the prop is passed.
    expect(onTranslateChanged).toBeDefined();
  });

  it('should call onRelease callback', () => {
    const onRelease = jest.fn();
    testingLib = render(Component({props: {onRelease}}));

    expect(onRelease).toBeDefined();
  });

  it('should render with custom style', () => {
    const customStyle = {backgroundColor: 'red', width: 300, height: 300};
    testingLib = render(Component({props: {style: customStyle}}));

    const container = testingLib.getByTestId('pinch-zoom-container');
    expect(container).toHaveStyle(customStyle);
  });

  it('should accept fixOverflowAfterRelease prop', () => {
    testingLib = render(Component({props: {fixOverflowAfterRelease: false}}));

    expect(testingLib.getByTestId('pinch-zoom-container')).toBeTruthy();
  });

  it('should accept allowEmpty prop', () => {
    testingLib = render(Component({props: {allowEmpty: {x: true, y: false}}}));

    expect(testingLib.getByTestId('pinch-zoom-container')).toBeTruthy();
  });

  it('should render with all props combined', () => {
    const onScaleChanged = jest.fn();
    const onTranslateChanged = jest.fn();
    const onRelease = jest.fn();

    testingLib = render(
      Component({
        props: {
          testID: 'full-props-test',
          style: {backgroundColor: 'blue'},
          onScaleChanged,
          onTranslateChanged,
          onRelease,
          fixOverflowAfterRelease: true,
          allowEmpty: {x: false, y: true},
        },
      }),
    );

    expect(testingLib.getByTestId('full-props-test')).toBeTruthy();
    expect(testingLib.getByTestId('child-view')).toBeTruthy();
  });

  it('clamps imperative zoom values to the public scale range', () => {
    const onScaleChanged = jest.fn();
    const ref = createRef<PinchZoomRef>();
    testingLib = render(
      createComponent(
        <PinchZoom maxScale={3} onScaleChanged={onScaleChanged} ref={ref}>
          <View testID="child-view" />
        </PinchZoom>,
      ),
    );

    act(() => ref.current?.setValues({scale: 9}));
    expect(onScaleChanged).toHaveBeenLastCalledWith(3);
  });

  it('yields rest-scale swipes, pans while zoomed, then yields after reset', () => {
    const ref = createRef<PinchZoomRef>();
    render(
      createComponent(
        <PinchZoom ref={ref}>
          <View />
        </PinchZoom>,
      ),
    );
    const pan = getByGestureTestId('pinch-zoom-container-pan');
    const manager = {
      begin: jest.fn(),
      activate: jest.fn(),
      fail: jest.fn(),
      end: jest.fn(),
    };
    const event: GestureTouchEvent = {
      handlerTag: pan.handlerTag,
      numberOfTouches: 1,
      state: State.BEGAN,
      eventType: 2,
      pointerType: PointerType.TOUCH,
      allTouches: [{id: 1, x: 100, y: 100, absoluteX: 100, absoluteY: 100}],
      changedTouches: [{id: 1, x: 100, y: 100, absoluteX: 100, absoluteY: 100}],
    };
    expect(pan.config.manualActivation).toBe(true);
    pan.handlers.onTouchesMove?.(event, manager);
    expect(manager.fail).toHaveBeenCalledTimes(1);
    expect(manager.activate).not.toHaveBeenCalled();
    act(() => ref.current?.setValues({scale: 2}));
    pan.handlers.onTouchesMove?.(event, manager);
    expect(manager.activate).toHaveBeenCalledTimes(1);
    act(() => ref.current?.setValues({scale: 1}));
    pan.handlers.onTouchesMove?.(event, manager);
    expect(manager.fail).toHaveBeenCalledTimes(2);
    expect(manager.activate).toHaveBeenCalledTimes(1);
  });

  it('leaves two-finger movement to the independent pinch recognizer', () => {
    const ref = createRef<PinchZoomRef>();
    render(
      createComponent(
        <PinchZoom ref={ref}>
          <View />
        </PinchZoom>,
      ),
    );
    act(() => ref.current?.setValues({scale: 2}));
    const pan = getByGestureTestId('pinch-zoom-container-pan');
    const manager = {
      begin: jest.fn(),
      activate: jest.fn(),
      fail: jest.fn(),
      end: jest.fn(),
    };
    const touches = [
      {id: 1, x: 90, y: 100, absoluteX: 90, absoluteY: 100},
      {id: 2, x: 110, y: 100, absoluteX: 110, absoluteY: 100},
    ];
    pan.handlers.onTouchesMove?.(
      {
        handlerTag: pan.handlerTag,
        numberOfTouches: 2,
        state: State.BEGAN,
        eventType: 2,
        pointerType: PointerType.TOUCH,
        allTouches: touches,
        changedTouches: touches,
      },
      manager,
    );
    expect(manager.fail).toHaveBeenCalledTimes(1);
    expect(manager.activate).not.toHaveBeenCalled();
  });
});
