import '@testing-library/jest-native/extend-expect';

import React, {type ReactElement, useRef} from 'react';
import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import {StyleSheet, View} from 'react-native';

import {createComponent} from '../../../../test/testUtils';
import AlertDialog, {type AlertDialogContext} from './AlertDialog';
import {ThemeType} from '../../../providers/ThemeProvider';
import {Button} from '../../uis/Button/Button';
import {Typography} from '../../uis/Typography/Typography';

let testingLib: RenderAPI;

const TestComponent = ({themeType}: {themeType?: ThemeType}): ReactElement => {
  const alertDialogRef = useRef<AlertDialogContext>(null);

  return createComponent(<AlertDialog ref={alertDialogRef} />, themeType);
};

describe('[AlertDialog]', () => {
  it('should render without crashing', () => {
    testingLib = render(<TestComponent />);

    const json = testingLib.toJSON();
    expect(json).toBeTruthy();
  });

  describe('Size prop', () => {
    it('should accept small size', async () => {
      const TestWithSize = (): ReactElement => {
        const alertDialogRef = useRef<AlertDialogContext>(null);

        React.useEffect(() => {
          alertDialogRef.current?.open({
            title: 'Test Title',
            body: 'Test Body',
            size: 'small',
          });
        }, []);

        return createComponent(<AlertDialog ref={alertDialogRef} />);
      };

      testingLib = render(<TestWithSize />);

      await waitFor(() => {
        expect(testingLib.getByText('Test Title')).toBeTruthy();
      });
    });

    it('should accept medium size', async () => {
      const TestWithSize = (): ReactElement => {
        const alertDialogRef = useRef<AlertDialogContext>(null);

        React.useEffect(() => {
          alertDialogRef.current?.open({
            title: 'Test Title',
            body: 'Test Body',
            size: 'medium',
          });
        }, []);

        return createComponent(<AlertDialog ref={alertDialogRef} />);
      };

      testingLib = render(<TestWithSize />);

      await waitFor(() => {
        expect(testingLib.getByText('Test Title')).toBeTruthy();
      });
    });

    it('should accept large size', async () => {
      const TestWithSize = (): ReactElement => {
        const alertDialogRef = useRef<AlertDialogContext>(null);

        React.useEffect(() => {
          alertDialogRef.current?.open({
            title: 'Test Title',
            body: 'Test Body',
            size: 'large',
          });
        }, []);

        return createComponent(<AlertDialog ref={alertDialogRef} />);
      };

      testingLib = render(<TestWithSize />);

      await waitFor(() => {
        expect(testingLib.getByText('Test Title')).toBeTruthy();
      });
    });

    it('should accept custom numeric size', async () => {
      const TestWithSize = (): ReactElement => {
        const alertDialogRef = useRef<AlertDialogContext>(null);

        React.useEffect(() => {
          alertDialogRef.current?.open({
            title: 'Test Title',
            body: 'Test Body',
            size: 20,
          });
        }, []);

        return createComponent(<AlertDialog ref={alertDialogRef} />);
      };

      testingLib = render(<TestWithSize />);

      await waitFor(() => {
        expect(testingLib.getByText('Test Title')).toBeTruthy();
      });
    });

    it('should default to medium size when size is not specified', async () => {
      const TestWithoutSize = (): ReactElement => {
        const alertDialogRef = useRef<AlertDialogContext>(null);

        React.useEffect(() => {
          alertDialogRef.current?.open({
            title: 'Test Title',
            body: 'Test Body',
          });
        }, []);

        return createComponent(<AlertDialog ref={alertDialogRef} />);
      };

      testingLib = render(<TestWithoutSize />);

      await waitFor(() => {
        expect(testingLib.getByText('Test Title')).toBeTruthy();
      });
    });
  });

  describe('Content rendering', () => {
    it('renders custom header, body and actions and exposes safe dismissal', () => {
      const ref = React.createRef<AlertDialogContext>();
      const Harness = (): ReactElement => {
        React.useEffect(() => {
          ref.current?.open({
            title: 'Accessible decision',
            body: 'Fallback body',
            actions: [<View key="fallback" testID="fallback-action" />],
            renderHeader: () => (
              <View>
                <View testID="custom-icon" />
                <Typography.Heading5>Custom header</Typography.Heading5>
              </View>
            ),
            renderBody: () => (
              <Typography.Body2>Custom explanation</Typography.Body2>
            ),
            renderActions: ({close}) => [
              <Button key="cancel" text="Dismiss custom" onPress={close} />,
            ],
          });
        }, []);
        return createComponent(<AlertDialog ref={ref} />);
      };
      const view = render(<Harness />);
      expect(
        view.getByLabelText('Accessible decision').props.accessibilityRole,
      ).toBe('alert');
      expect(view.getByTestId('custom-icon')).toBeTruthy();
      expect(view.getByText('Custom header')).toBeTruthy();
      expect(view.getByText('Custom explanation')).toBeTruthy();
      expect(view.queryByText('Fallback body')).toBeNull();
      expect(view.queryByTestId('fallback-action')).toBeNull();
      fireEvent.press(view.getByText('Dismiss custom'));
      expect(view.queryByText('Custom header')).toBeNull();
    });

    it('supports render functions in controlled mode', () => {
      const close = jest.fn();
      const view = render(
        createComponent(
          <AlertDialog
            visible
            title="Decision"
            onClose={close}
            renderHeader={() => (
              <Typography.Heading5>Header slot</Typography.Heading5>
            )}
            renderBody={() => <Typography.Body2>Body slot</Typography.Body2>}
            renderActions={({close}) => [
              <Button key="close" text="Close slot" onPress={close} />,
            ]}
          />,
        ),
      );
      expect(view.getByText('Header slot')).toBeTruthy();
      expect(view.getByText('Body slot')).toBeTruthy();
      fireEvent.press(view.getByText('Close slot'));
      expect(close).toHaveBeenCalledTimes(1);
    });
    it('preserves an intrinsic action width for trailing action groups', () => {
      const view = render(
        createComponent(
          <AlertDialog
            visible
            title="Decision"
            actions={[
              <View
                key="cancel"
                testID="intrinsic-action"
                style={{flex: 0, minWidth: 80}}
              />,
              <View key="confirm" testID="second-action" />,
            ]}
          />,
        ),
      );
      expect(
        StyleSheet.flatten(view.getByTestId('intrinsic-action').props.style),
      ).toMatchObject({flex: 0, minWidth: 80});
      expect(
        StyleSheet.flatten(view.getByTestId('second-action').props.style),
      ).toMatchObject({flex: 1, marginLeft: 12});
    });
    it('should render title and body', async () => {
      const TestWithContent = (): ReactElement => {
        const alertDialogRef = useRef<AlertDialogContext>(null);

        React.useEffect(() => {
          alertDialogRef.current?.open({
            title: 'Alert Title',
            body: 'Alert Body Content',
            size: 'medium',
          });
        }, []);

        return createComponent(<AlertDialog ref={alertDialogRef} />);
      };

      testingLib = render(<TestWithContent />);

      await waitFor(() => {
        expect(testingLib.getByText('Alert Title')).toBeTruthy();
        expect(testingLib.getByText('Alert Body Content')).toBeTruthy();
        expect(
          testingLib.getByRole('button', {name: 'Close dialog'}),
        ).toBeTruthy();
      });
    });

    it('should render with actions', async () => {
      const TestWithActions = (): ReactElement => {
        const alertDialogRef = useRef<AlertDialogContext>(null);

        React.useEffect(() => {
          alertDialogRef.current?.open({
            title: 'Confirm',
            body: 'Are you sure?',
            size: 'medium',
            actions: [
              <button key="cancel">Cancel</button>,
              <button key="ok">OK</button>,
            ],
          });
        }, []);

        return createComponent(<AlertDialog ref={alertDialogRef} />);
      };

      testingLib = render(<TestWithActions />);

      await waitFor(() => {
        expect(testingLib.getByText('Confirm')).toBeTruthy();
      });
    });
  });

  describe('Close functionality', () => {
    it('should close dialog when close is called', async () => {
      const TestWithClose = (): ReactElement => {
        const alertDialogRef = useRef<AlertDialogContext>(null);

        React.useEffect(() => {
          alertDialogRef.current?.open({
            title: 'Test Title',
            body: 'Test Body',
            size: 'medium',
          });

          setTimeout(() => {
            alertDialogRef.current?.close();
          }, 100);
        }, []);

        return createComponent(<AlertDialog ref={alertDialogRef} />);
      };

      testingLib = render(<TestWithClose />);

      await waitFor(() => {
        expect(testingLib.getByText('Test Title')).toBeTruthy();
      });

      await waitFor(
        () => {
          expect(testingLib.queryByText('Test Title')).toBeNull();
        },
        {timeout: 500},
      );
    });
  });

  describe('Controlled dialog', () => {
    it('renders while visible and does not dismiss on outside press', async () => {
      const onClose = jest.fn();
      const TestControlled = (): ReactElement =>
        createComponent(
          <AlertDialog
            body="Nickname field"
            closeOnTouchOutside={false}
            onClose={onClose}
            showCloseButton
            title="Set nickname"
            visible
          />,
        );

      testingLib = render(<TestControlled />);

      await waitFor(() => {
        expect(testingLib.getByText('Set nickname')).toBeTruthy();
        expect(testingLib.getByText('Nickname field')).toBeTruthy();
      });

      fireEvent.press(testingLib.getByTestId('alert-dialog-backdrop'));
      expect(onClose).not.toHaveBeenCalled();
      expect(testingLib.getByText('Set nickname')).toBeTruthy();
    });

    it('notifies onClose when the backdrop is pressed', async () => {
      const onClose = jest.fn();
      const TestControlledBackdrop = (): ReactElement =>
        createComponent(
          <AlertDialog body="Body" onClose={onClose} title="Title" visible />,
        );

      testingLib = render(<TestControlledBackdrop />);

      await waitFor(() => {
        expect(testingLib.getByText('Title')).toBeTruthy();
      });

      fireEvent.press(testingLib.getByTestId('alert-dialog-backdrop'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('ignores imperative open while visible is controlled', async () => {
      const TestControlledOpen = (): ReactElement => {
        const alertDialogRef = useRef<AlertDialogContext>(null);

        React.useEffect(() => {
          alertDialogRef.current?.open({
            title: 'Imperative title',
            body: 'Imperative body',
          });
        }, []);

        return createComponent(
          <AlertDialog
            ref={alertDialogRef}
            body="Controlled body"
            title="Controlled title"
            visible={false}
          />,
        );
      };

      testingLib = render(<TestControlledOpen />);

      expect(testingLib.queryByText('Imperative title')).toBeNull();
      expect(testingLib.queryByText('Controlled title')).toBeNull();
    });

    it('notifies onClose when the close control is pressed', async () => {
      const onClose = jest.fn();
      const TestControlledClose = (): ReactElement =>
        createComponent(
          <AlertDialog body="Body" onClose={onClose} title="Title" visible />,
        );

      testingLib = render(<TestControlledClose />);

      await waitFor(() => {
        expect(testingLib.getByText('Title')).toBeTruthy();
      });

      fireEvent.press(testingLib.getByRole('button', {name: 'Close dialog'}));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Dark mode', () => {
    it.each(['light', 'dark'] as const)(
      'dims rather than whitens the page in %s mode',
      (themeType) => {
        const view = render(
          createComponent(
            <AlertDialog title="Confirm" backdropOpacity={0.46} visible />,
            themeType,
          ),
        );
        expect(
          StyleSheet.flatten(
            view.getByTestId('alert-dialog-overlay').props.style,
          ).backgroundColor,
        ).toBe('rgba(0,0,0,0.46)');
      },
    );
    it('should render in dark mode', async () => {
      const TestDarkMode = (): ReactElement => {
        const alertDialogRef = useRef<AlertDialogContext>(null);

        React.useEffect(() => {
          alertDialogRef.current?.open({
            title: 'Dark Mode Title',
            body: 'Dark Mode Body',
            size: 'medium',
          });
        }, []);

        return createComponent(<AlertDialog ref={alertDialogRef} />, 'dark');
      };

      testingLib = render(<TestDarkMode />);

      await waitFor(() => {
        expect(testingLib.getByText('Dark Mode Title')).toBeTruthy();
      });
    });
  });
});
