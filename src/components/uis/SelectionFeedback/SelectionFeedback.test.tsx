import React from 'react';
import {Text} from 'react-native';
import {render} from '@testing-library/react-native';
import {
  cancelAnimation,
  useReducedMotion,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {SelectionFeedback} from './SelectionFeedback';

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  useReducedMotion: jest.fn(() => false),
  cancelAnimation: jest.fn(),
  withTiming: jest.fn((value: number) => value),
  withSpring: jest.fn((value: number) => value),
}));

describe('SelectionFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useReducedMotion).mockReturnValue(false);
  });
  it('stays still on mount, rerenders and unchanged selections', () => {
    const screen = render(
      <SelectionFeedback selection="mint" testID="feedback">
        <Text>Selected colour</Text>
      </SelectionFeedback>,
    );
    screen.rerender(
      <SelectionFeedback selection="mint" testID="feedback">
        <Text>Updated copy</Text>
      </SelectionFeedback>,
    );
    expect(withTiming).not.toHaveBeenCalled();
    expect(screen.getByText('Updated copy')).toBeTruthy();
    expect(screen.getByTestId('feedback')).toHaveStyle({
      transform: [{scale: 1}],
    });
  });
  it('confirms a changed identity and interrupts an obsolete pulse', () => {
    const screen = render(<SelectionFeedback selection={0} />);
    screen.rerender(<SelectionFeedback selection={1} />);
    expect(withTiming).toHaveBeenCalledWith(
      1.08,
      expect.objectContaining({duration: 100}),
    );
    expect(withSpring).toHaveBeenCalledWith(
      1,
      expect.objectContaining({duration: 350, dampingRatio: 0.8}),
    );
    const cancelled = jest.mocked(cancelAnimation).mock.calls.length;
    screen.rerender(<SelectionFeedback selection={2} />);
    expect(cancelAnimation).toHaveBeenCalledTimes(cancelled + 2);
    expect(withSpring).toHaveBeenCalledTimes(2);
    screen.unmount();
    expect(cancelAnimation).toHaveBeenCalledTimes(cancelled + 3);
  });
  it('does not pulse a deselected item', () => {
    const screen = render(<SelectionFeedback selection="mint" />);
    screen.rerender(<SelectionFeedback active={false} selection="blue" />);
    expect(withSpring).not.toHaveBeenCalled();
  });
  it.each(['system', 'explicit'] as const)(
    'honours %s reduced motion',
    (preference) => {
      jest.mocked(useReducedMotion).mockReturnValue(preference === 'system');
      const reducedMotion = preference === 'explicit' ? true : undefined;
      const screen = render(
        <SelectionFeedback selection={0} reducedMotion={reducedMotion} />,
      );
      screen.rerender(
        <SelectionFeedback selection={1} reducedMotion={reducedMotion} />,
      );
      expect(withTiming).not.toHaveBeenCalled();
      expect(withSpring).not.toHaveBeenCalled();
    },
  );
});
