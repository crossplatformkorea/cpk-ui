jest.mock('react-native/Libraries/Utilities/Platform', () => {
  const platform = {
    OS: 'web',
    select: (options: Record<string, unknown>) => options.web ?? options.default,
  };

  return {...platform, default: platform};
});

import React, {type ReactElement} from 'react';
import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import type {IconButtonProps} from './IconButton';
import {IconButton} from './IconButton';

let testingLib: RenderAPI;

const Component = (props?: IconButtonProps): ReactElement =>
  createComponent(<IconButton {...props} />);

describe('[IconButton]', () => {
  it('should render without crashing', () => {
    testingLib = render(Component());

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('should render `outlined` button', () => {
    testingLib = render(
      Component({
        type: 'outlined',
      }),
    );

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('applies and removes hover styles from pointer events', () => {
    testingLib = render(
      Component({
        icon: 'Plus',
        testID: 'hover-icon-button',
      }),
    );

    const button = testingLib.getByTestId('hover-icon-button');
    const container = testingLib.getByTestId('button-container');

    fireEvent(button, 'pointerEnter');
    expect(container).toHaveStyle({shadowOpacity: 0.24});

    fireEvent(button, 'pointerLeave');
    expect(container).not.toHaveStyle({shadowOpacity: 0.24});
  });

  describe('loading', () => {
    it('should render `loading` button', () => {
      testingLib = render(
        Component({
          loading: true,
        }),
      );

      const json = testingLib.toJSON();

      expect(json).toBeTruthy();
    });

    it('should render `disabled` button', () => {
      testingLib = render(
        Component({
          loading: true,
          disabled: true,
        }),
      );

      const json = testingLib.toJSON();

      expect(json).toBeTruthy();
    });
  });

  describe('size', () => {
    it('should renders large size', () => {
      testingLib = render(
        Component({
          size: 'large',
        }),
      );

      const json = testingLib.toJSON();

      expect(json).toBeTruthy();
    });

    it('should renders small size', () => {
      testingLib = render(
        Component({
          size: 'small',
        }),
      );

      const json = testingLib.toJSON();

      expect(json).toBeTruthy();
    });
  });

  describe('type', () => {
    it('should render color==="info"', () => {
      testingLib = render(
        Component({
          color: 'info',
        }),
      );

      const json = testingLib.toJSON();

      expect(json).toBeTruthy();
    });

    it('should renders primary color', () => {
      testingLib = render(
        Component({
          color: 'primary',
        }),
      );

      const json = testingLib.toJSON();

      expect(json).toBeTruthy();
    });

    it('should renders secondary color', () => {
      testingLib = render(
        Component({
          color: 'secondary',
        }),
      );

      const json = testingLib.toJSON();

      expect(json).toBeTruthy();
    });

    it('should renders danger color', () => {
      testingLib = render(
        Component({
          color: 'danger',
        }),
      );

      const json = testingLib.toJSON();

      expect(json).toBeTruthy();
    });

    it('should renders warning color', () => {
      testingLib = render(
        Component({
          color: 'warning',
        }),
      );

      const json = testingLib.toJSON();

      expect(json).toBeTruthy();
    });
  });

  it('should render `disabled` button', () => {
    testingLib = render(
      Component({
        disabled: true,
      }),
    );

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  describe('accessibility', () => {
    it('should have accessibilityRole="button"', () => {
      testingLib = render(
        Component({
          testID: 'a11y-icon-button',
          icon: 'Plus',
        }),
      );

      const button = testingLib.getByTestId('a11y-icon-button');
      expect(button.props.accessibilityRole).toBe('button');
    });

    it('should use icon name as default accessibilityLabel', () => {
      testingLib = render(
        Component({
          testID: 'a11y-icon-button',
          icon: 'Plus',
        }),
      );

      const button = testingLib.getByTestId('a11y-icon-button');
      expect(button.props.accessibilityLabel).toBe('Plus');
    });

    it('should use custom accessibilityLabel when provided', () => {
      testingLib = render(
        Component({
          testID: 'a11y-icon-button',
          icon: 'Plus',
          accessibilityLabel: 'Add new item',
        }),
      );

      const button = testingLib.getByTestId('a11y-icon-button');
      expect(button.props.accessibilityLabel).toBe('Add new item');
    });

    it('should expose busy and disabled states while loading', () => {
      testingLib = render(
        Component({
          icon: 'Plus',
          loading: true,
          testID: 'a11y-icon-button',
        }),
      );

      const button = testingLib.getByTestId('a11y-icon-button');
      expect(button.props.accessibilityState).toEqual(
        expect.objectContaining({busy: true, disabled: true}),
      );
    });
  });
});
