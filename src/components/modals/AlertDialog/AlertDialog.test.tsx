import '@testing-library/jest-native/extend-expect';

import React, {type ReactElement, useRef} from 'react';
import type {RenderAPI} from '@testing-library/react-native';
import {render, waitFor} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import AlertDialog, {type AlertDialogContext} from './AlertDialog';
import {ThemeType} from '../../../providers/ThemeProvider';

let testingLib: RenderAPI;

const TestComponent = ({
  themeType,
}: {
  themeType?: ThemeType;
}): ReactElement => {
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

  describe('Dark mode', () => {
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
