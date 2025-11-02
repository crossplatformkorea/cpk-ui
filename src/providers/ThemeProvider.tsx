import '@expo/match-media';

import React, {useEffect, useState, type ReactElement} from 'react';
import type {ColorSchemeName} from 'react-native';
import {useMediaQuery} from 'react-responsive';
import {ThemeProvider as KStyledThemeProvider} from 'kstyled';
import type {DefaultTheme} from 'kstyled';

import type {CpkTheme, ThemeParam} from '../utils/theme';
import {dark, light} from '../utils/colors';
import {useDebouncedColorScheme} from '../hooks/useDebouncedColorScheme';
import createCtx from '../utils/createCtx';

type ResponsiveDesignMode = 'mobile-first' | 'desktop-first';
export type ThemeType = 'light' | 'dark';

export type ThemeContext = {
  themeType: ColorSchemeName;
  media: {
    isPortrait: boolean;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };
  theme: DefaultTheme & CpkTheme;
  changeThemeType: (themeType?: ColorSchemeName) => void;
};

const [useCtx, CpkProvider] = createCtx<ThemeContext>();

export type ThemeProps = {
  children?: ReactElement;
  initialThemeType?: ThemeType;
  customTheme?: ThemeParam;
  /*
    @description
    default: mobile-first
    - mobile-first: mobile first responsive design mode
    - desktop-first: desktop first responsive design mode
  */
  responsiveDesignMode?: ResponsiveDesignMode;
};

const genTheme = (type: ThemeType, themeParam: ThemeParam): any => {
  const theme = type === 'light' ? light : dark;
  const customTheme = themeParam?.[type] || {};

  return {
    bg: {
      ...theme.bg,
      ...(customTheme.bg || {}),
    },
    role: {
      ...theme.role,
      ...(customTheme.role || {}),
    },
    text: {
      ...theme.text,
      ...(customTheme.text || {}),
    },
    button: {
      ...theme.button,
      primary: {
        ...theme.button.primary,
        ...(customTheme.button?.primary || {}),
      },
      secondary: {
        ...theme.button.secondary,
        ...(customTheme.button?.secondary || {}),
      },
      success: {
        ...theme.button.success,
        ...(customTheme.button?.success || {}),
      },
      warning: {
        ...theme.button.warning,
        ...(customTheme.button?.warning || {}),
      },
      danger: {
        ...theme.button.danger,
        ...(customTheme.button?.danger || {}),
      },
      info: {
        ...theme.button.info,
        ...(customTheme.button?.info || {}),
      },
      light: {
        ...theme.button.light,
        ...(customTheme.button?.light || {}),
      },
      disabled: {
        ...theme.button.disabled,
        ...(customTheme.button?.disabled || {}),
      },
    },
  };
};

export function ThemeProvider({
  children,
  initialThemeType,
  customTheme = {},
  responsiveDesignMode = 'mobile-first',
}: ThemeProps): ReactElement {
  console.log('🎨 ThemeProvider rendered with initialThemeType:', initialThemeType);

  const isPortrait = useMediaQuery({orientation: 'portrait'});

  const isMobile = useMediaQuery(
    responsiveDesignMode === 'mobile-first'
      ? {minWidth: 0}
      : {minWidth: 0, maxWidth: 767},
  );

  const isTablet = useMediaQuery(
    responsiveDesignMode === 'mobile-first'
      ? {minWidth: 767}
      : {minWidth: 768, maxWidth: 992},
  );

  const isDesktop = useMediaQuery(
    responsiveDesignMode === 'mobile-first' ? {minWidth: 992} : {minWidth: 0},
  );

  const colorScheme = useDebouncedColorScheme();
  const [themeType, setThemeType] = useState(initialThemeType ?? colorScheme);

  useEffect(() => {
    if (initialThemeType) {
      setThemeType(initialThemeType);
    } else {
      setThemeType(colorScheme);
    }
  }, [colorScheme, initialThemeType]);

  const changeThemeType = (themeTypeProp?: ColorSchemeName): void => {
    if (!themeTypeProp) {
      setThemeType(themeType === 'light' ? 'dark' : 'light');

      return;
    }

    setThemeType(themeTypeProp);
  };

  const baseTheme = {
    light: genTheme('light', customTheme),
    dark: genTheme('dark', customTheme),
  }[themeType || 'light'];

  const media = {
    isPortrait,
    isMobile,
    isTablet,
    isDesktop,
  };

  const theme = {
    ...baseTheme,
    ...media,
  } as DefaultTheme & CpkTheme;

  return (
    <CpkProvider
      value={{
        media,
        themeType,
        changeThemeType,
        theme,
      }}
    >
      <KStyledThemeProvider theme={theme}>{children}</KStyledThemeProvider>
    </CpkProvider>
  );
}

export {useCtx as useTheme};
