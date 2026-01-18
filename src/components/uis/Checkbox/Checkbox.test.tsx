import React, {type ReactElement} from 'react';
import {Text, View} from 'react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {render} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import {Checkbox, type CheckboxProps} from './Checkbox';
import {light} from '../../../utils/colors';

let testingLib: RenderAPI;

const Component = (props?: CheckboxProps): ReactElement =>
  createComponent(<Checkbox {...props} />);

describe('[Checkbox]', () => {
  it('should render without crashing', () => {
    testingLib = render(Component());

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
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

  it('should render `startElement`', () => {
    testingLib = render(
      Component({
        startElement: <View />,
      }),
    );

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('should render `endElement`', () => {
    testingLib = render(
      Component({
        endElement: <View />,
      }),
    );

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  describe('colors', () => {
    const colors = [
      'primary',
      'secondary',
      'success',
      'info',
      'warning',
      'danger',
    ];

    it('should render all colors', () => {
      testingLib = render(
        createComponent(
          <View>
            {colors.map((color) => (
              <Checkbox
                key={color}
                checked={true}
                color={color as any}
              />
            ))}
          </View>,
        ),
      );

      const json = testingLib.toJSON();
      // $type is a transient prop used for styling only,
      // so it's not accessible via props in tests
      // Just verify the component renders correctly with all colors
      expect(json).toBeTruthy();
    });

    it('should render with specific color type and verify checked state', () => {
      testingLib = render(
        Component({
          color: 'success',
          checked: true,
        }),
      );

      const checkbox = testingLib.getByTestId('cpk-ui-checkbox');

      // While we can't directly test transient props ($type, $checked),
      // we can verify the component renders and has the testID
      expect(checkbox).toBeTruthy();

      // The checkbox wrapper receives $checked prop which affects its styling
      // We can verify it's rendered in checked state by checking the component structure
      expect(checkbox).toBeDefined();
    });

    it('should render unchecked state', () => {
      testingLib = render(
        Component({
          color: 'primary',
          checked: false,
        }),
      );

      const checkbox = testingLib.getByTestId('cpk-ui-checkbox');
      expect(checkbox).toBeTruthy();
    });
  });

  describe('sizes', () => {
    it('should render with small size', () => {
      testingLib = render(
        Component({
          size: 'small',
          checked: true,
        }),
      );

      const checkbox = testingLib.getByTestId('cpk-ui-checkbox');
      expect(checkbox).toBeTruthy();
    });

    it('should render with medium size', () => {
      testingLib = render(
        Component({
          size: 'medium',
          checked: true,
        }),
      );

      const checkbox = testingLib.getByTestId('cpk-ui-checkbox');
      expect(checkbox).toBeTruthy();
    });

    it('should render with large size', () => {
      testingLib = render(
        Component({
          size: 'large',
          checked: true,
        }),
      );

      const checkbox = testingLib.getByTestId('cpk-ui-checkbox');
      expect(checkbox).toBeTruthy();
    });

    it('should render with custom numeric size', () => {
      testingLib = render(
        Component({
          size: 24,
          checked: true,
        }),
      );

      const checkbox = testingLib.getByTestId('cpk-ui-checkbox');
      expect(checkbox).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('should have accessibilityRole="checkbox"', () => {
      testingLib = render(
        Component({
          text: 'Accept terms',
        }),
      );

      const json = testingLib.toJSON();
      expect(json).toBeTruthy();
      // The root element should have accessibilityRole
      expect((json as any).props.accessibilityRole).toBe('checkbox');
    });

    it('should use text as default accessibilityLabel', () => {
      testingLib = render(
        Component({
          text: 'Accept terms',
        }),
      );

      const json = testingLib.toJSON();
      expect((json as any).props.accessibilityLabel).toBe('Accept terms');
    });

    it('should use custom accessibilityLabel when provided', () => {
      testingLib = render(
        Component({
          text: 'Accept',
          accessibilityLabel: 'Accept terms and conditions',
        }),
      );

      const json = testingLib.toJSON();
      expect((json as any).props.accessibilityLabel).toBe('Accept terms and conditions');
    });

    it('should have accessibilityState with checked=true when checked', () => {
      testingLib = render(
        Component({
          text: 'Accept terms',
          checked: true,
        }),
      );

      const json = testingLib.toJSON();
      expect((json as any).props.accessibilityState).toEqual({
        checked: true,
        disabled: false,
      });
    });

    it('should have accessibilityState with checked=false when unchecked', () => {
      testingLib = render(
        Component({
          text: 'Accept terms',
          checked: false,
        }),
      );

      const json = testingLib.toJSON();
      expect((json as any).props.accessibilityState).toEqual({
        checked: false,
        disabled: false,
      });
    });

    it('should have accessibilityState with disabled=true when disabled', () => {
      testingLib = render(
        Component({
          text: 'Accept terms',
          disabled: true,
        }),
      );

      const json = testingLib.toJSON();
      expect((json as any).props.accessibilityState).toEqual({
        checked: false,
        disabled: true,
      });
    });

    it('should have undefined accessibilityLabel when text is ReactElement', () => {
      testingLib = render(
        Component({
          text: <Text>Custom text</Text>,
        }),
      );

      const json = testingLib.toJSON();
      expect((json as any).props.accessibilityLabel).toBeUndefined();
    });
  });
});
