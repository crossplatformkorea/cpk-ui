import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {useReducedMotion, withTiming} from 'react-native-reanimated';
import {createComponent} from '../../../../test/testUtils';
import {RadioButton} from './RadioButton';

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  useReducedMotion: jest.fn(() => false),
  cancelAnimation: jest.fn(),
  withTiming: jest.fn((value: number) => value),
  withSpring: jest.fn((value: number) => value),
}));

describe('RadioButton selection feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useReducedMotion).mockReturnValue(false);
  });
  it('confirms only a newly selected mark and keeps the row accessible', () => {
    const make = (selected: boolean): React.ReactElement =>
      createComponent(
        <RadioButton selected={selected} label="Option" testID="option" />,
      );
    const screen = render(make(false));
    expect(withTiming).not.toHaveBeenCalled();
    screen.rerender(make(true));
    expect(withTiming).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('option').props.accessibilityState.checked).toBe(
      true,
    );
    screen.rerender(make(true));
    screen.rerender(make(false));
    expect(withTiming).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('circle-option')).toHaveStyle({opacity: 0});
  });
  it.each(['system', 'disabled', 'opt-out'] as const)(
    'keeps the selection instant for %s',
    (reason) => {
      jest.mocked(useReducedMotion).mockReturnValue(reason === 'system');
      const onPress = jest.fn();
      const make = (selected: boolean): React.ReactElement =>
        createComponent(
          <RadioButton
            selected={selected}
            disabled={reason === 'disabled'}
            selectionAnimation={reason !== 'opt-out'}
            onPress={onPress}
            label="Option"
            testID="option"
          />,
        );
      const screen = render(make(false));
      screen.rerender(make(true));
      expect(withTiming).not.toHaveBeenCalled();
      expect(screen.getByTestId('circle-option')).toHaveStyle({opacity: 1});
      if (reason === 'disabled') {
        fireEvent.press(screen.getByTestId('option'));
        expect(onPress).not.toHaveBeenCalled();
      }
    },
  );
});
