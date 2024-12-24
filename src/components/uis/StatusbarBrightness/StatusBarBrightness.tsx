import type {StatusBarStyle} from 'react-native';
import {StatusBar} from 'react-native';
import {useTheme} from '../../../providers/ThemeProvider';

function StatusBarBrightness({type}: {type?: StatusBarStyle}): JSX.Element {
  const {themeType} = useTheme();

  const statusColor: StatusBarStyle = type
    ? type
    : themeType === 'light'
      ? 'dark-content'
      : 'light-content';

  return <StatusBar barStyle={statusColor} />;
}

export default StatusBarBrightness;
