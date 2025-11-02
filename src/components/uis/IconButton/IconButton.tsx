import React, {useCallback, useMemo, useRef, type ReactElement} from 'react';
import type {StyleProp, TouchableHighlightProps, ViewStyle} from 'react-native';
import {Platform, TouchableHighlight, View} from 'react-native';
import {useHover} from 'react-native-web-hooks';
import {css} from 'kstyled';

import type {IconName} from '../Icon/Icon';
import {Icon} from '../Icon/Icon';
import {LoadingIndicator} from '../LoadingIndicator/LoadingIndicator';
import {CpkTheme, getTheme} from '../../../utils/theme';
import {useTheme} from '../../../providers/ThemeProvider';
import * as Haptics from 'expo-haptics';

type Styles = {
  container?: StyleProp<ViewStyle>;
  icon?: StyleProp<ViewStyle>;
  disabled?: StyleProp<ViewStyle>;
  hovered?: StyleProp<ViewStyle>;
};

type ButtonType = 'text' | 'solid' | 'outlined';

type ButtonColorType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light';

type ButtonSizeType = 'small' | 'medium' | 'large' | number;

// Memoized styles calculation function
const ButtonStyles = ({
  theme,
  type,
  color,
  loading,
  disabled,
}: {
  theme: CpkTheme;
  type: ButtonType;
  color: ButtonColorType;
  loading?: boolean;
  disabled?: boolean;
}) => {
  const isDisabled = disabled || loading;

  let backgroundColor = theme.bg.basic;
  let borderColor = 'transparent';
  let iconColor = theme.text.basic;

  if (type === 'solid') {
    backgroundColor = isDisabled
      ? theme.button.disabled.bg
      : theme.button[color].bg;
    borderColor = backgroundColor;
  }

  if (type === 'outlined') {
    backgroundColor = isDisabled
      ? theme.bg.disabled
      : theme.bg.basic;
    borderColor = isDisabled
      ? theme.bg.disabled
      : theme.button[color].bg;
  }

  if (type === 'solid' || color === 'light') {
    iconColor = theme.button[color].text;
  }

  return {
    backgroundColor,
    borderColor,
    borderWidth: type === 'outlined' ? 1 : 0,
    iconColor,
    disabledBackgroundColor:
      type === 'solid' && !loading ? theme.button.disabled.bg : theme.bg.basic,
    disabledBorderColor: theme.bg.disabled,
    disabledTextColor: theme.button.disabled.text,
  };
};

export type IconButtonProps = {
  testID?: string;
  type?: ButtonType;
  color?: ButtonColorType;
  size?: ButtonSizeType | number;
  disabled?: boolean;
  loading?: boolean;
  loadingElement?: ReactElement;
  icon?: IconName;
  iconElement?: ReactElement;
  style?: StyleProp<Omit<ViewStyle, 'borderRadius' | 'padding'>>;
  styles?: Styles;
  onPress?: TouchableHighlightProps['onPress'];
  activeOpacity?: number;
  touchableHighlightProps?: Omit<TouchableHighlightProps, 'onPress' | 'style'>;
  hapticFeedback?: Haptics.ImpactFeedbackStyle;
};

export function IconButton({
  testID,
  type = 'solid',
  color = 'primary',
  size = 'medium',
  disabled,
  loading = false,
  loadingElement,
  icon,
  iconElement,
  style,
  styles,
  onPress,
  activeOpacity = 0.95,
  touchableHighlightProps,
  hapticFeedback,
}: IconButtonProps): ReactElement {
  const ref = useRef<React.ElementRef<typeof TouchableHighlight>>(null);
  const hovered = useHover(ref);
  const {theme} = useTheme();

  // Memoize button styles
  const buttonStylesConfig = useMemo(() => ButtonStyles({
    theme,
    type,
    color,
    loading,
    disabled,
  }), [theme, type, color, loading, disabled]);

  // Memoize icon size calculation
  const iconSize = useMemo(() => {
    return size === 'large'
      ? 32
      : size === 'medium'
        ? 24
        : size === 'small'
          ? 16
          : size;
  }, [size]);

  // Memoize style strings
  const borderRadiusStr = useMemo(() => '99px', []);
  const borderWidthStr = useMemo(() => `${buttonStylesConfig.borderWidth}px`, [buttonStylesConfig.borderWidth]);

  // Memoize composite styles
  const compositeStyles: Styles = useMemo(() => ({
    container: [
      css`
        background-color: ${buttonStylesConfig.backgroundColor};
        border-color: ${buttonStylesConfig.borderColor};
        border-width: ${borderWidthStr};
        padding: 12px;
      `,
      styles?.container,
    ],
    icon: [
      css`
        color: ${buttonStylesConfig.iconColor};
      `,
      styles?.icon,
    ],
    disabled: [
      css`
        background-color: ${buttonStylesConfig.disabledBackgroundColor};
        border-color: ${buttonStylesConfig.disabledBorderColor};
      `,
      styles?.disabled,
    ],
    hovered: [
      {
        shadowColor: theme.text.basic,
        shadowOpacity: 0.24,
        shadowRadius: 16,
        elevation: 10,
      },
      styles?.hovered,
    ],
  }), [buttonStylesConfig, borderWidthStr, theme.text.basic, styles]);

  // Memoize press handler
  const handlePress = useCallback((e: any) => {
    onPress?.(e);
    if (hapticFeedback) {
      Haptics.impactAsync(hapticFeedback);
    }
  }, [onPress, hapticFeedback]);

  // Memoize loading view
  const LoadingView = useMemo(() => 
    loadingElement || (
      <LoadingIndicator
        color={theme.text.disabled}
        size="small"
        style={css`
          justify-content: center;
          align-items: center;
          height: ${iconSize}px;
          width: ${iconSize}px;
        `}
      />
    ),
    [loadingElement, theme.text.disabled, iconSize]
  );

  // Memoize icon view
  const IconView = useMemo(() => 
    iconElement || (
      <Icon
        color={buttonStylesConfig.iconColor}
        name={icon || 'QuestBoxFill'}
        size={iconSize}
        style={compositeStyles?.icon}
      />
    ),
    [iconElement, buttonStylesConfig.iconColor, icon, iconSize, compositeStyles?.icon]
  );

  // Memoize container styles
  const containerStyles = useMemo(() => [
    css`
      flex-direction: row;
      border-radius: ${borderRadiusStr};
    `,
    style,
  ], [borderRadiusStr, style]);

  // Memoize inner container styles
  const innerContainerStyles = useMemo(() => [
    css`
      padding: 4px;
      border-radius: ${borderRadiusStr};
      flex-direction: row;
      justify-content: center;
      align-items: center;
    `,
    compositeStyles.container,
    hovered && !disabled && compositeStyles.hovered,
    disabled && compositeStyles.disabled,
  ], [borderRadiusStr, compositeStyles, hovered, disabled]);

  return (
    <View style={containerStyles}>
      <TouchableHighlight
        activeOpacity={activeOpacity}
        delayPressIn={50}
        disabled={disabled || loading}
        onPress={handlePress}
        ref={Platform.select({
          web: ref,
          default: undefined,
        })}
        style={css`
          border-radius: ${borderRadiusStr};
        `}
        testID={testID}
        underlayColor={theme.role.underlay}
        {...touchableHighlightProps}
      >
        <View
          style={innerContainerStyles}
          testID={loading ? 'loading-view' : 'button-container'}
        >
          {loading ? LoadingView : IconView}
        </View>
      </TouchableHighlight>
    </View>
  );
}

// Export memoized component for better performance
export default React.memo(IconButton) as typeof IconButton;
