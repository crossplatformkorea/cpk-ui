import React, {useRef} from 'react';
import type {StyleProp, TouchableHighlightProps, ViewStyle} from 'react-native';
import {Platform, TouchableHighlight, View} from 'react-native';
import {useHover} from 'react-native-web-hooks';
import {css} from '@emotion/native';

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

export const ButtonStyles = ({
  theme,
  type = 'solid',
  color = 'primary',
  loading,
  disabled,
}: {
  theme?: CpkTheme;
  type?: ButtonType;
  color?: ButtonColorType;
  disabled?: boolean;
  loading?: boolean;
}): {
  padding?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  iconColor?: string;
  disabledBackgroundColor: string;
  disabledBorderColor: string;
  disabledTextColor: string;
} => {
  theme = getTheme(theme);

  let backgroundColor = theme.button[color].bg;
  let borderColor = theme.button[color].bg;
  let iconColor = theme.button[color].bg;

  if (disabled) {
    backgroundColor = theme.button.disabled.bg;
    borderColor = theme.button.disabled.text;
    iconColor = theme.button.disabled.text;
  }

  if (['text', 'outlined'].includes(type)) {
    backgroundColor = theme.bg.basic;
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
  loadingElement?: React.JSX.Element;
  icon?: IconName;
  iconElement?: React.JSX.Element;
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
}: IconButtonProps): React.JSX.Element {
  const ref = useRef<React.ElementRef<typeof TouchableHighlight>>(null);
  const hovered = useHover(ref);
  const {theme} = useTheme();

  const {
    backgroundColor,
    borderColor,
    borderWidth,
    iconColor,
    disabledBackgroundColor,
    disabledBorderColor,
  } = ButtonStyles({
    theme,
    type,
    color,
    loading,
    disabled,
  });

  const iconSize =
    size === 'large'
      ? 32
      : size === 'medium'
        ? 24
        : size === 'small'
          ? 16
          : size;

  const borderWidthStr = `${borderWidth + 'px'}`;
  const borderRadiusStr = `99px`;

  const compositeStyles: Styles = {
    container: [
      css`
        background-color: ${backgroundColor};
        border-color: ${borderColor};
        border-width: ${borderWidthStr};
        padding: 12px;
      `,
      styles?.container,
    ],
    icon: [
      css`
        color: ${iconColor};
      `,
      styles?.icon,
    ],
    disabled: [
      css`
        background-color: ${disabledBackgroundColor};
        border-color: ${disabledBorderColor};
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
  };

  return (
    <View
      style={[
        css`
          flex-direction: row;
          border-radius: ${borderRadiusStr};
        `,
        style,
      ]}
    >
      <TouchableHighlight
        activeOpacity={activeOpacity}
        delayPressIn={50}
        disabled={disabled || loading}
        onPress={(e) => {
          onPress?.(e);

          if (hapticFeedback) {
            Haptics.impactAsync(hapticFeedback);
          }
        }}
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
          style={[
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
          ]}
          testID={loading ? 'loading-view' : 'button-container'}
        >
          {loading
            ? loadingElement || (
                <LoadingIndicator
                  color={theme.text.disabled}
                  size="small"
                  style={css`
                    justify-content: center;
                    align-items: center;
                    height: ${iconSize + 'px'};
                    width: ${iconSize + 'px'};
                  `}
                />
              )
            : iconElement || (
                <Icon
                  color={iconColor}
                  name={icon || 'QuestBoxFill'}
                  size={iconSize}
                  style={compositeStyles?.icon}
                />
              )}
        </View>
      </TouchableHighlight>
    </View>
  );
}
