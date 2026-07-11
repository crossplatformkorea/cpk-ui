import React from 'react';
import {Text} from 'react-native';
import {fireEvent, render} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import {CustomPressable} from './CustomPressable';

describe('[CustomPressable]', () => {
  it('provides button semantics and handles presses', () => {
    const onPress = jest.fn();
    const {getByRole} = render(
      createComponent(
        <CustomPressable accessibilityLabel="Press action" onPress={onPress}>
          <Text>Press me</Text>
        </CustomPressable>,
      ),
    );
    const pressable = getByRole('button', {name: 'Press action'});

    fireEvent.press(pressable);

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(pressable.props.hitSlop).toEqual({
      top: 4,
      bottom: 4,
      left: 6,
      right: 6,
    });
  });

  it('allows callers to override role and hit slop', () => {
    const customHitSlop = {top: 10, bottom: 10, left: 12, right: 12};
    const {getByRole} = render(
      createComponent(
        <CustomPressable
          accessibilityLabel="Open resource"
          accessibilityRole="link"
          hitSlop={customHitSlop}
        >
          <Text>Resource</Text>
        </CustomPressable>,
      ),
    );

    expect(getByRole('link', {name: 'Open resource'}).props.hitSlop).toEqual(
      customHitSlop,
    );
  });
});
