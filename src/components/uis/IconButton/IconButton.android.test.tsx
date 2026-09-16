jest.mock('react-native/Libraries/Utilities/Platform', () => {
  const platform = {
    OS: 'android',
    select: (options: Record<string, unknown>) =>
      options.android ?? options.default,
  };
  return {...platform, default: platform};
});
import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {createComponent} from '../../../../test/testUtils';
import {IconButton} from './IconButton';

describe('Android icon feedback', () => {
  it('keeps a transparent circular target and blocks busy presses', () => {
    const onPress = jest.fn();
    const component = (loading: boolean) =>
      createComponent(
        <IconButton
          accessibilityLabel="Add"
          icon="Plus"
          loading={loading}
          onPress={onPress}
          type="text"
          testID="add"
        />,
      );
    const screen = render(component(false));
    expect(screen.getByTestId('button-container')).toHaveStyle({
      backgroundColor: 'transparent',
    });
    expect(screen.getByTestId('add')).toHaveStyle({
      borderRadius: 99,
      overflow: 'hidden',
    });
    expect(screen.getByTestId('add').props.nativeForegroundAndroid).toEqual(
      expect.objectContaining({type: 'RippleAndroid', borderless: false}),
    );
    fireEvent.press(screen.getByTestId('add'));
    expect(onPress).toHaveBeenCalledTimes(1);
    screen.rerender(component(true));
    fireEvent.press(screen.getByTestId('add'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
