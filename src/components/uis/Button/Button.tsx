import React, {useCallback, useMemo, useRef, type ReactElement} from 'react';
import type {
  Insets,
  StyleProp,
  TextStyle,
  TouchableHighlightProps,
  ViewStyle,
} from 'react-native';
import {Platform, TouchableHighlight, View} from 'react-native';
import {useHover} from 'react-native-web-hooks';
import {styled, css} from 'kstyled';

import {useTheme} from '../../../providers/ThemeProvider';
import {cloneElemWithDefaultColors} from '../../../utils/guards';
import type {CpkTheme} from '../../../utils/theme';
import {LoadingIndicator} from '../LoadingIndicator/LoadingIndicator';
import {Typography} from '../Typography/Typography';
import * as Haptics from 'expo-haptics';

export type ButtonType = 'text' | 'solid' | 'outlined';
export type ButtonColorType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light';
export type ButtonSizeType = 'small' | 'medium' | 'large' | number;

export type Props = {
  testID?: string;
  type?: ButtonType;
  color?: ButtonColorType;
  size?: ButtonSizeType;
  disabled?: boolean;
  loading?: boolean;
  loadingColor?: string;
  loadingElement?: ReactElement;
  text?: string | ReactElement;
  borderRadius?: number;
  startElement?: ReactElement;
  endElement?: ReactElement;
  style?: StyleProp<Omit<ViewStyle, 'borderRadius' | 'padding'>>;
  styles?: Styles;
  onPress?: TouchableHighlightProps['onPress'];
  activeOpacity?: TouchableHighlightProps['activeOpacity'];
  touchableHighlightProps?: Omit<
    TouchableHighlightProps,
    'onPress' | 'activeOpacity' | 'style'
  >;
  hitSlop?: null | Insets | number | undefined;
  hapticFeedback?: Haptics.ImpactFeedbackStyle;
};

type Styles = {
  container?: StyleProp<ViewStyle>;
  content?: StyleProp<ViewStyle>;
  loading?: StyleProp<ViewStyle>;
  text?: StyleProp<TextStyle>;
  disabled?: StyleProp<ViewStyle>;
  disabledText?: StyleProp<TextStyle>;
  hovered?: StyleProp<ViewStyle>;
};

type ButtonContainerStyleProps = {
  $type: ButtonType;
  $size?: ButtonSizeType;
  $outlined?: boolean;
  $disabled?: boolean;
  $loading?: boolean;
};

const ButtonContainer = styled.View<ButtonContainerStyleProps>`
  align-self: stretch;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

// Memoize style calculation function
const calculateStyles = ({
  theme,
  type,
  color,
  size,
  loading,
  disabled,
  borderRadius,
  hovered,
  styles,
}: {
  theme: CpkTheme;
  type: ButtonType;
  color: ButtonColorType;
  size: ButtonSizeType;
  loading: boolean;
  disabled: boolean;
  borderRadius: number;
  hovered: boolean;
  styles?: Styles;
}): Styles => {
  const isDisabled = disabled || loading;
  const padding =
    type === 'text'
      ? '8px'
      : typeof size === 'number'
        ? `${size * 0.6}px ${size * 1.2}px`
        : size === 'large'
          ? '16px 24px'
          : size === 'medium'
            ? '12px 24px'
            : size === 'small'
              ? '8px 16px'
              : '12px 24px';

  const borderWidth = type === 'outlined' ? 1 : 0;
  const backgroundColor =
    type === 'solid'
      ? isDisabled
        ? theme.button.disabled.bg
        : theme.button[color].bg
      : type === 'outlined'
        ? theme.bg.basic
        : 'transparent';

  const borderColor =
    type === 'outlined'
      ? isDisabled
        ? theme.bg.disabled
        : theme.button[color].bg
      : backgroundColor;

  const textColor = isDisabled
    ? theme.button.disabled.text
    : type === 'solid'
      ? theme.button[color].text
      : theme.button[color].bg;

  return {
    container: [
      css`
        background-color: ${backgroundColor};
        border-top-color: ${borderColor};
        border-bottom-color: ${borderColor};
        border-left-color: ${borderColor};
        border-right-color: ${borderColor};
        border-width: ${borderWidth}px;
        padding: ${padding};
      `,
      styles?.container,
    ],
    content: [
      css`
        flex-direction: row;
        align-items: center;
        opacity: ${loading ? '0' : '1'};
        gap: 8px;
      `,
      styles?.content,
    ],
    loading: [
      css`
        position: absolute;
        opacity: ${loading ? '1' : '0'};
      `,
      styles?.loading,
    ],
    text: [
      css`
        color: ${textColor};
      `,
      styles?.text,
    ],
    hovered: hovered
      ? [
          {
            shadowColor: 'black',
            shadowOpacity: 0.24,
            shadowRadius: 16,
            elevation: 10,
            borderRadius,
          },
          styles?.hovered,
        ]
      : undefined,
    disabled: isDisabled
      ? [
          css`
            background-color: ${theme.button.disabled.bg};
            border-top-color: ${theme.bg.disabled};
            border-bottom-color: ${theme.bg.disabled};
            border-left-color: ${theme.bg.disabled};
            border-right-color: ${theme.bg.disabled};
          `,
          styles?.disabled,
        ]
      : undefined,
  };
};

// Memoize button state hook
const useButtonState = ({
  disabled,
  onPress,
  loading,
}: {
  disabled?: boolean;
  onPress?: TouchableHighlightProps['onPress'];
  loading: boolean;
}): {
  innerDisabled: boolean;
  isLoading: boolean;
} => {
  return useMemo(
    () => ({
      innerDisabled: disabled || !onPress,
      isLoading: loading,
    }),
    [disabled, onPress, loading],
  );
};

export function Button({
  testID,
  type = 'solid',
  color = 'primary',
  size = 'medium',
  disabled,
  loading = false,
  loadingElement,
  text,
  startElement,
  endElement,
  style,
  styles,
  onPress,
  activeOpacity = 0.8,
  touchableHighlightProps,
  borderRadius = 4,
  loadingColor,
  hitSlop = {top: 8, bottom: 8, left: 8, right: 8},
  hapticFeedback,
}: Props): ReactElement {
  const ref = useRef<React.ElementRef<typeof TouchableHighlight>>(null);
  const hovered = useHover(ref);
  const {theme} = useTheme();

  const {innerDisabled} = useButtonState({disabled, onPress, loading});

  // Memoize styles calculation
  const compositeStyles: Styles = useMemo(
    () =>
      calculateStyles({
        theme,
        type,
        color,
        size,
        loading,
        disabled: innerDisabled,
        borderRadius,
        hovered,
        styles,
      }),
    [
      theme,
      type,
      color,
      size,
      loading,
      innerDisabled,
      borderRadius,
      hovered,
      styles,
    ],
  );

  // Memoize loading view
  const LoadingView = useMemo(
    () =>
      loadingElement ?? (
        <LoadingIndicator
          color={
            loadingColor
              ? loadingColor
              : type === 'solid'
                ? theme.text.contrast
                : theme.text.basic
          }
          size="small"
        />
      ),
    [loadingElement, loadingColor, type, theme.text.contrast, theme.text.basic],
  );

  // Memoize style resolvers
  const resolveStyle = useCallback(<T,>(style: StyleProp<T>): T | undefined => {
    if (Array.isArray(style)) {
      return style.find((s): s is T => !!s);
    }
    return (style as T) || undefined;
  }, []);

  const viewStyle = useMemo(
    () => resolveStyle<ViewStyle>(compositeStyles.container),
    [resolveStyle, compositeStyles.container],
  );
  const textStyle = useMemo(
    () => resolveStyle<TextStyle>(compositeStyles.text),
    [resolveStyle, compositeStyles.text],
  );

  // Memoize child view
  const ChildView = useMemo(
    () => (
      <>
        {cloneElemWithDefaultColors({
          element: startElement,
          backgroundColor: viewStyle?.backgroundColor,
          color: textStyle?.color,
        })}
        {!text || typeof text === 'string' ? (
          <Typography.Body2 style={compositeStyles.text}>
            {text}
          </Typography.Body2>
        ) : (
          text
        )}
        {cloneElemWithDefaultColors({
          element: endElement,
          backgroundColor: viewStyle?.backgroundColor,
          color: textStyle?.color,
        })}
      </>
    ),
    [
      startElement,
      endElement,
      text,
      compositeStyles.text,
      viewStyle?.backgroundColor,
      textStyle?.color,
    ],
  );

  // Memoize container renderer
  const renderContainer = useCallback(
    ({
      children,
      loadingView,
    }: {
      children: ReactElement;
      loadingView: ReactElement;
    }): ReactElement => (
      <ButtonContainer
        $disabled={innerDisabled}
        $size={size}
        style={[
          hovered && !innerDisabled && compositeStyles.hovered,
          compositeStyles.container,
          type === 'text' &&
            css`
              background-color: transparent;
            `,
          innerDisabled && compositeStyles.disabled,
          !!borderRadius && {borderRadius},
        ]}
        testID={loading ? 'loading-view' : 'button-container'}
        $type={type}
      >
        <View style={compositeStyles.content}>{children}</View>
        <View style={compositeStyles.loading}>{loadingView}</View>
      </ButtonContainer>
    ),
    [
      innerDisabled,
      size,
      compositeStyles.container,
      compositeStyles.hovered,
      compositeStyles.disabled,
      compositeStyles.content,
      compositeStyles.loading,
      hovered,
      type,
      loading,
    ],
  );

  // Memoize press handler
  const handlePress = useCallback(
    (e: any) => {
      onPress?.(e);
      if (hapticFeedback) {
        Haptics.impactAsync(hapticFeedback);
      }
    },
    [onPress, hapticFeedback],
  );

  // Memoize button styles
  const buttonStyles = useMemo(
    () => [
      style,
      css`
        border-radius: ${borderRadius}px;
      `,
    ],
    [style, borderRadius],
  );

  return (
    <TouchableHighlight
      activeOpacity={activeOpacity}
      delayPressIn={30}
      disabled={innerDisabled || loading || !onPress}
      hitSlop={hitSlop}
      onPress={handlePress}
      ref={Platform.select({
        web: ref,
        default: undefined,
      })}
      style={buttonStyles}
      testID={testID}
      underlayColor={type === 'text' ? 'transparent' : theme.role.underlay}
      {...touchableHighlightProps}
    >
      {renderContainer({
        children: ChildView,
        loadingView: LoadingView,
      })}
    </TouchableHighlight>
  );
}

// Export memoized component for better performance
export default React.memo(Button) as typeof Button;
