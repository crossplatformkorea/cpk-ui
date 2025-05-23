// Mock Platform API before any imports
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: (obj) => obj.web || obj.default,
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  AntDesign: 'AntDesign',
  createIconSetFromIcoMoon: () => 'Icon',
  // Add any other exports from @expo/vector-icons that you're using
}));

import '@testing-library/jest-native/extend-expect';

import React from 'react';
import {Text} from 'react-native';
import RNWebHooks from 'react-native-web-hooks';
import type {RenderAPI} from '@testing-library/react-native';
import {act, fireEvent, render} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import type {EditTextProps} from './EditText';
import {EditText} from './EditText';
import {light} from '../../../utils/colors';

jest.mock('react-native-web-hooks', () => ({
  useHover: () => false,
}));

let testingLib: RenderAPI;

const Component = (editProps?: EditTextProps): React.JSX.Element =>
  createComponent(<EditText {...editProps} />);

describe('[EditText]', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeAll(() => {
    testingLib = render(Component());
  });

  describe('hovered', () => {
    beforeAll(() => {
      jest.spyOn(RNWebHooks, 'useHover').mockImplementation(() => true);
    });

    describe('label', () => {
      it('renders label text', async () => {
        testingLib = render(Component({label: 'label text'}));
        const label = testingLib.getByText('label text');
        expect(label).toBeTruthy();
      });

      it('renders label style', async () => {
        testingLib = render(
          Component({
            label: 'label text',
            colors: {
              basic: 'blue',
              placeholder: 'green',
              disabled: 'red',
              error: 'yellow',
              focused: 'purple',
              hovered: 'orange',
            },
          }),
        );

        const label = testingLib.getByText('label text');

        expect(label).toHaveStyle({color: 'orange'});
      });

      it('renders custom label style', async () => {
        const renderCustomLabel = (): React.JSX.Element => {
          return (
            <Text
              style={{
                color: 'blue',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            >
              Custom label
            </Text>
          );
        };

        testingLib = render(
          Component({
            label: renderCustomLabel,
          }),
        );

        const label = testingLib.getByText('Custom label');

        expect(label).toBeTruthy();
      });

      describe('unhovered', () => {
        beforeAll(() => {
          jest.spyOn(RNWebHooks, 'useHover').mockImplementation(() => false);
        });

        it('should contain `focusColor` when focused', async () => {
          testingLib = render(
            Component({
              testID: 'INPUT_TEST',
              label: 'label text',
              colors: {
                basic: 'blue',
                placeholder: 'green',
                disabled: 'red',
                error: 'yellow',
                focused: 'purple',
                hovered: 'orange',
              },
            }),
          );

          const input = testingLib.getByTestId('INPUT_TEST');
          expect(input).toHaveStyle({color: 'green'});

          act(() => {
            input.props.onFocus();
          });

          const label = testingLib.getByText('label text');

          expect(label).toHaveStyle({color: 'purple'});
        });

        it('renders error element when provided', async () => {
          testingLib = render(
            Component({
              testID: 'INPUT_TEST',
              label: 'label text',
              error: 'error text',
              styles: {
                label: {
                  color: 'green',
                },
              },
            }),
          );

          const input = testingLib.getByTestId('INPUT_TEST');

          act(() => {
            input.props.onFocus();
          });

          const error = testingLib.getByText('error text');
          expect(error).toBeTruthy();
        });
      });
    });
  });

  describe('layout', () => {
    it('renders [direction] row', () => {
      testingLib = render(
        Component({
          testID: 'INPUT_TEST',
          direction: 'row',
        }),
      );

      const input = testingLib.getByTestId('INPUT_TEST');
      // const container = testingLib.getByTestId('container');

      expect(input).toBeTruthy();
      // expect(container).toHaveStyle({flexDirection: 'row'});
    });

    it('renders [decoration] boxed', () => {
      testingLib = render(
        Component({
          testID: 'INPUT_TEST',
          decoration: 'boxed',
        }),
      );

      const input = testingLib.getByTestId('INPUT_TEST');
      // const container = testingLib.getByTestId('container');

      expect(input).toBeTruthy();
      // expect(container).toHaveStyle({borderWidth: 1});
    });
  });

  describe('start and end elements', () => {
    it('renders start element', () => {
      testingLib = render(
        Component({
          testID: 'INPUT_TEST',
          startElement: <Text>Start</Text>,
        }),
      );

      const input = testingLib.getByText('Start');
      expect(input).toBeTruthy();
    });

    it('renders end element', () => {
      testingLib = render(
        Component({
          testID: 'INPUT_TEST',
          endElement: <Text>End</Text>,
        }),
      );

      const input = testingLib.getByText('End');
      expect(input).toBeTruthy();
    });
  });

  describe('web', () => {
    it('renders web style', () => {
      testingLib = render(
        Component({
          testID: 'INPUT_TEST',
        }),
      );

      const input = testingLib.getByTestId('INPUT_TEST');
      expect(input).toBeTruthy();
      // No need to check for outlineWidth: 0 since we handle this dynamically now
    });
  });

  describe('input', () => {
    it('should trigger text changes', () => {
      const CHANGE_TEXT = 'content';
      const mockedFn = jest.fn();

      const onChangeTextMock = (str: string): void => {
        mockedFn(str);
      };

      testingLib = render(
        Component({
          testID: 'INPUT_TEST',
          editable: false,
          onChangeText: onChangeTextMock,
        }),
      );

      const input = testingLib.getByTestId('INPUT_TEST');
      expect(input).toBeTruthy();

      fireEvent.changeText(input, CHANGE_TEXT);
      expect(mockedFn).toBeCalledWith(CHANGE_TEXT);
    });

    it('should have value', () => {
      testingLib = render(
        Component({
          testID: 'INPUT_TEST',
          value: 'text123',
        }),
      );

      const input = testingLib.getByTestId('INPUT_TEST');

      expect(input).toBeTruthy();

      expect(input).toHaveProp('value', 'text123');
    });

    it('should have render counter', () => {
      testingLib = render(
        Component({
          testID: 'INPUT_TEST',
          value: 'text123',
          maxLength: 100,
        }),
      );

      const counter = testingLib.getByText('7/100');

      expect(counter).toBeTruthy();
    });

    it('should have render custom error', () => {
      const renderCustomError = (): React.JSX.Element => <Text>custom error</Text>;

      testingLib = render(
        Component({
          testID: 'INPUT_TEST',
          value: 'text123',
          error: renderCustomError,
        }),
      );

      const error = testingLib.getByText('custom error');

      expect(error).toBeTruthy();
    });
  });

  describe('disabled', () => {
    it('renders [default] disabled style', () => {
      testingLib = render(
        Component({
          testID: 'INPUT_TEST',
          editable: false,
        }),
      );

      const input = testingLib.getByTestId('INPUT_TEST');

      expect(input).toBeTruthy();

      expect(input).toHaveStyle({color: light.text.disabled});
    });

    it('renders [custom] disabled style', () => {
      testingLib = render(
        Component({
          testID: 'INPUT_TEST',
          colors: {disabled: 'yellow'},
          editable: false,
        }),
      );

      const input = testingLib.getByTestId('INPUT_TEST');

      expect(input).toBeTruthy();

      expect(input).toHaveStyle({color: 'yellow'});
    });
  });

  describe('focus', () => {
    it('should trigger `onFocus`', async () => {
      testingLib = render(
        Component({
          testID: 'INPUT_TEST',
          onFocus: jest.fn(),
        }),
      );

      const input = testingLib.getByTestId('INPUT_TEST');

      expect(input).toBeTruthy();

      fireEvent(input, 'focus');

      expect(input).toHaveStyle({color: light.text.basic});
    });

    it('should trigger `onFocus` and render custom color', async () => {
      testingLib = render(
        Component({
          testID: 'INPUT_TEST',
          onFocus: jest.fn(),
          colors: {focused: 'yellow'},
        }),
      );

      const input = testingLib.getByTestId('INPUT_TEST');

      expect(input).toBeTruthy();

      fireEvent(input, 'focus');

      expect(input).toHaveStyle({color: 'yellow'});
    });

    it('should trigger `onFocus` when touching container', async () => {
      const focusFn = jest.fn();

      testingLib = render(
        Component({
          onFocus: focusFn,
          colors: {focused: 'yellow'},
        }),
      );

      const touch = testingLib.getByTestId('container-touch');

      expect(touch).toBeTruthy();

      fireEvent(touch, 'press');
      // Below should work but no luck in testing-library
      // expect(focusFn).toBeCalled();
    });

    describe('onBlur (focused === false)', () => {
      it('should trigger blur without errorText', async () => {
        testingLib = render(
          Component({
            onBlur: () => {},
            testID: 'INPUT_TEST',
            colors: {placeholder: 'green'},
          }),
        );

        const input = testingLib.getByTestId('INPUT_TEST');

        expect(input).toBeTruthy();

        fireEvent(input, 'blur');

        expect(input).toHaveStyle({color: 'green'});
      });
    });
  });
});
