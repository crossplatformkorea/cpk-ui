import '@testing-library/jest-native/extend-expect';

import React, {type ReactElement, useRef} from 'react';
import type {RenderAPI} from '@testing-library/react-native';
import {render, waitFor} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import Snackbar, {type SnackbarContext} from './Snackbar';
import {ThemeType} from '../../../providers/ThemeProvider';

let testingLib: RenderAPI;

const TestComponent = ({
  themeType,
}: {
  themeType?: ThemeType;
}): ReactElement => {
  const snackbarRef = useRef<SnackbarContext>(null);

  return createComponent(<Snackbar ref={snackbarRef} />, themeType);
};

describe('[Snackbar]', () => {
  it('should render without crashing', () => {
    testingLib = render(<TestComponent />);

    const json = testingLib.toJSON();
    expect(json).toBeTruthy();
  });

  describe('Size prop', () => {
    it('should accept small size', async () => {
      const TestWithSize = (): ReactElement => {
        const snackbarRef = useRef<SnackbarContext>(null);

        React.useEffect(() => {
          snackbarRef.current?.open({
            text: 'Test message',
            size: 'small',
            timer: 10000,
          });
        }, []);

        return createComponent(<Snackbar ref={snackbarRef} />);
      };

      testingLib = render(<TestWithSize />);

      await waitFor(() => {
        expect(testingLib.getByText('Test message')).toBeTruthy();
      });
    });

    it('should accept medium size', async () => {
      const TestWithSize = (): ReactElement => {
        const snackbarRef = useRef<SnackbarContext>(null);

        React.useEffect(() => {
          snackbarRef.current?.open({
            text: 'Test message',
            size: 'medium',
            timer: 10000,
          });
        }, []);

        return createComponent(<Snackbar ref={snackbarRef} />);
      };

      testingLib = render(<TestWithSize />);

      await waitFor(() => {
        expect(testingLib.getByText('Test message')).toBeTruthy();
      });
    });

    it('should accept large size', async () => {
      const TestWithSize = (): ReactElement => {
        const snackbarRef = useRef<SnackbarContext>(null);

        React.useEffect(() => {
          snackbarRef.current?.open({
            text: 'Test message',
            size: 'large',
            timer: 10000,
          });
        }, []);

        return createComponent(<Snackbar ref={snackbarRef} />);
      };

      testingLib = render(<TestWithSize />);

      await waitFor(() => {
        expect(testingLib.getByText('Test message')).toBeTruthy();
      });
    });

    it('should accept custom numeric size', async () => {
      const TestWithSize = (): ReactElement => {
        const snackbarRef = useRef<SnackbarContext>(null);

        React.useEffect(() => {
          snackbarRef.current?.open({
            text: 'Test message',
            size: 18,
            timer: 10000,
          });
        }, []);

        return createComponent(<Snackbar ref={snackbarRef} />);
      };

      testingLib = render(<TestWithSize />);

      await waitFor(() => {
        expect(testingLib.getByText('Test message')).toBeTruthy();
      });
    });

    it('should default to medium size when size is not specified', async () => {
      const TestWithoutSize = (): ReactElement => {
        const snackbarRef = useRef<SnackbarContext>(null);

        React.useEffect(() => {
          snackbarRef.current?.open({
            text: 'Test message',
            timer: 10000,
          });
        }, []);

        return createComponent(<Snackbar ref={snackbarRef} />);
      };

      testingLib = render(<TestWithoutSize />);

      await waitFor(() => {
        expect(testingLib.getByText('Test message')).toBeTruthy();
      });
    });
  });

  describe('Content rendering', () => {
    it('should render text message', async () => {
      const TestWithText = (): ReactElement => {
        const snackbarRef = useRef<SnackbarContext>(null);

        React.useEffect(() => {
          snackbarRef.current?.open({
            text: 'Snackbar message content',
            size: 'medium',
            timer: 10000,
          });
        }, []);

        return createComponent(<Snackbar ref={snackbarRef} />);
      };

      testingLib = render(<TestWithText />);

      await waitFor(() => {
        expect(testingLib.getByText('Snackbar message content')).toBeTruthy();
      });
    });

    it('should render with action text', async () => {
      const TestWithAction = (): ReactElement => {
        const snackbarRef = useRef<SnackbarContext>(null);

        React.useEffect(() => {
          snackbarRef.current?.open({
            text: 'Action test',
            actionText: 'Undo',
            size: 'medium',
            timer: 10000,
          });
        }, []);

        return createComponent(<Snackbar ref={snackbarRef} />);
      };

      testingLib = render(<TestWithAction />);

      await waitFor(() => {
        expect(testingLib.getByText('Action test')).toBeTruthy();
        expect(testingLib.getByText('Undo')).toBeTruthy();
      });
    });
  });

  describe('Color variants', () => {
    it('should render with primary color', async () => {
      const TestWithColor = (): ReactElement => {
        const snackbarRef = useRef<SnackbarContext>(null);

        React.useEffect(() => {
          snackbarRef.current?.open({
            text: 'Primary color',
            color: 'primary',
            size: 'medium',
            timer: 10000,
          });
        }, []);

        return createComponent(<Snackbar ref={snackbarRef} />);
      };

      testingLib = render(<TestWithColor />);

      await waitFor(() => {
        expect(testingLib.getByText('Primary color')).toBeTruthy();
      });
    });

    it('should render with danger color', async () => {
      const TestWithColor = (): ReactElement => {
        const snackbarRef = useRef<SnackbarContext>(null);

        React.useEffect(() => {
          snackbarRef.current?.open({
            text: 'Danger color',
            color: 'danger',
            size: 'medium',
            timer: 10000,
          });
        }, []);

        return createComponent(<Snackbar ref={snackbarRef} />);
      };

      testingLib = render(<TestWithColor />);

      await waitFor(() => {
        expect(testingLib.getByText('Danger color')).toBeTruthy();
      });
    });

    it('should render with info color', async () => {
      const TestWithColor = (): ReactElement => {
        const snackbarRef = useRef<SnackbarContext>(null);

        React.useEffect(() => {
          snackbarRef.current?.open({
            text: 'Info color',
            color: 'info',
            size: 'medium',
            timer: 10000,
          });
        }, []);

        return createComponent(<Snackbar ref={snackbarRef} />);
      };

      testingLib = render(<TestWithColor />);

      await waitFor(() => {
        expect(testingLib.getByText('Info color')).toBeTruthy();
      });
    });
  });

  describe('Close functionality', () => {
    it('should close snackbar when close is called', async () => {
      const TestWithClose = (): ReactElement => {
        const snackbarRef = useRef<SnackbarContext>(null);

        React.useEffect(() => {
          snackbarRef.current?.open({
            text: 'Test message',
            size: 'medium',
            timer: 10000,
          });

          setTimeout(() => {
            snackbarRef.current?.close();
          }, 100);
        }, []);

        return createComponent(<Snackbar ref={snackbarRef} />);
      };

      testingLib = render(<TestWithClose />);

      await waitFor(() => {
        expect(testingLib.getByText('Test message')).toBeTruthy();
      });

      await waitFor(
        () => {
          expect(testingLib.queryByText('Test message')).toBeNull();
        },
        {timeout: 500},
      );
    });
  });

  describe('Dark mode', () => {
    it('should render in dark mode', async () => {
      const TestDarkMode = (): ReactElement => {
        const snackbarRef = useRef<SnackbarContext>(null);

        React.useEffect(() => {
          snackbarRef.current?.open({
            text: 'Dark mode message',
            size: 'medium',
            timer: 10000,
          });
        }, []);

        return createComponent(<Snackbar ref={snackbarRef} />, 'dark');
      };

      testingLib = render(<TestDarkMode />);

      await waitFor(() => {
        expect(testingLib.getByText('Dark mode message')).toBeTruthy();
      });
    });
  });
});
