jest.mock('react-native/Libraries/Utilities/Platform', () => {
  const platform = {
    OS: 'android',
    select: (options: Record<string, unknown>) =>
      options.android ?? options.default,
  };
  return {...platform, default: platform};
});

import React from 'react';
import {View} from 'react-native';
import {fireEvent, render} from '@testing-library/react-native';
import {createComponent} from '../../../../test/testUtils';
import {Button} from './Button';
import {CustomPressable} from '../CustomPressable/CustomPressable';

describe('Android button feedback', () => {
  it('clips one foreground ripple to the button and preserves parents while busy', () => {
    const onPress = jest.fn();
    const renderButton = (loading: boolean) =>
      createComponent(
        <Button
          borderRadius={28}
          loading={loading}
          onPress={onPress}
          text="Create ledger"
          testID="create"
        />,
      );
    const screen = render(renderButton(false));
    const pressable = screen.UNSAFE_getByType(CustomPressable);
    expect(pressable.props.android_ripple).toEqual(
      expect.objectContaining({foreground: true, borderless: false}),
    );
    expect(screen.getByTestId('create')).toHaveStyle({
      borderRadius: 28,
      overflow: 'hidden',
    });
    const content = screen.getByTestId('button-container');
    const parents = content.findAllByType(View);
    fireEvent.press(screen.getByTestId('create'));
    expect(onPress).toHaveBeenCalledTimes(1);
    screen.rerender(renderButton(true));
    expect(screen.getByTestId('loading-view')).toBe(content);
    for (const parent of parents)
      expect(content.findAllByType(View)).toContain(parent);
    fireEvent.press(screen.getByTestId('create'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
