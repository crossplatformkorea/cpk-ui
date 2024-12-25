import type {MutableRefObject} from 'react';
import {useRef} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';
import {useFonts} from 'expo-font';

import createCtx from '../utils/createCtx';
import {
  ThemeContext,
  ThemeProps,
  ThemeProvider,
  useTheme,
} from './ThemeProvider';
import Snackbar, {
  SnackbarContext,
  SnackbarOptions,
} from '../components/modals/Snackbar/Snackbar';
import AlertDialog, {
  AlertDialogContext,
} from '../components/modals/AlertDialog/AlertDialog';
import {LoadingIndicator} from '../components/uis/LoadingIndicator/LoadingIndicator';

export type ThemeType = ThemeContext['themeType'];
export type DoobooTheme = ThemeContext['theme'];

export type CpkContext = {
  assetLoaded: boolean;
  snackbar: SnackbarContext;
  alertDialog: AlertDialogContext;
} & ThemeContext;

const [useCtx, Provider] = createCtx<CpkContext>();

function AppProvider({children}: {children: JSX.Element}): JSX.Element {
  const [assetLoaded] = useFonts({
    cpk: require('../components/uis/Icon/cpk.ttf'),
    'Pretendard-Bold': require('../components/uis/Icon/Pretendard-Bold.otf'),
    Pretendard: require('../components/uis/Icon/Pretendard-Regular.otf'),
    'Pretendard-Thin': require('../components/uis/Icon/Pretendard-Thin.otf'),
  });

  const themeContext = useTheme();

  const snackbar =
    useRef<SnackbarContext>() as MutableRefObject<SnackbarContext>;

  const alertDialog =
    useRef<AlertDialogContext>() as MutableRefObject<AlertDialogContext>;

  /**
   ** Snackbar
   */
  const snackbarContext: SnackbarContext = {
    open: (snackbarOption): void => {
      snackbar.current && snackbar.current.open(snackbarOption);
    },
    close: (): void => {
      snackbar.current && snackbar.current.close();
    },
  };

  /**
   ** AlertDialog
   */
  const alertDialogContext: AlertDialogContext = {
    open: (alertDialogOptions): void => {
      alertDialog.current && alertDialog.current.open(alertDialogOptions);
    },
    close: (): void => {
      alertDialog.current && alertDialog.current.close();
    },
  };

  return (
    <View
      style={css`
        flex: 1;
      `}
    >
      <Provider
        value={{
          ...themeContext,
          assetLoaded,
          snackbar: snackbarContext,
          alertDialog: alertDialogContext,
        }}
      >
        {!assetLoaded ? (
          <LoadingIndicator
            style={css`
              align-self: stretch;
              flex: 1;
              justify-content: center;
              background-color: ${themeContext.theme.bg.basic};
            `}
          />
        ) : (
          <>
            {children}
            <Snackbar ref={snackbar} />
            <AlertDialog ref={alertDialog} />
          </>
        )}
      </Provider>
    </View>
  );
}

export type CpkProviderProps = {
  themeConfig?: Omit<ThemeProps, 'children'>;
  snackbarConfig?: SnackbarOptions;
  children: JSX.Element;
};

function CpkWithThemeProvider(props: CpkProviderProps): JSX.Element {
  const {themeConfig} = props;

  return (
    <ThemeProvider {...themeConfig}>
      <AppProvider {...props} />
    </ThemeProvider>
  );
}

export {useCtx as useCPK, CpkWithThemeProvider as CpkProvider};
