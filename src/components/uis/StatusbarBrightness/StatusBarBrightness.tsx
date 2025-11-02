import React, {useMemo, type ReactElement} from 'react';
import type {StatusBarStyle} from 'react-native';
import {StatusBar} from 'react-native';
import {useTheme} from '../../../providers/ThemeProvider';

type StatusBarBrightnessProps = {
  type?: StatusBarStyle;
};

function StatusBarBrightness({type}: StatusBarBrightnessProps): ReactElement {
  const {themeType} = useTheme();

  // Memoize status bar color calculation
  const statusColor: StatusBarStyle = useMemo(() => {
    return type
      ? type
      : themeType === 'light'
        ? 'dark-content'
        : 'light-content';
  }, [type, themeType]);

  return <StatusBar barStyle={statusColor} />;
}

// Export memoized component for better performance
export default React.memo(StatusBarBrightness) as typeof StatusBarBrightness;
