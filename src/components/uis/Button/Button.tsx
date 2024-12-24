import React, {useCallback, useRef} from 'react';
import type {
  Insets,
  StyleProp,
  TextStyle,
  TouchableHighlightProps,
  ViewStyle,
} from 'react-native';
import {Platform, Text, TouchableHighlight, View} from 'react-native';
import {useHover} from 'react-native-web-hooks';
import styled, {css} from '@emotion/native';

import {useTheme} from '../../../providers/ThemeProvider';
import {cloneElemWithDefaultColors} from '../../../utils/guards';
import type {CpkTheme} from '../../../utils/theme';
import {LoadingIndicator} from '../LoadingIndicator';

export type ButtonType = 'text' | 'solid' | 'outlined';
export type ButtonColorType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light';
export type ButtonSizeType = 'small' | 'medium' | 'large';

export type Props = {
  testID?: string;
  type?: ButtonType;
  color?: ButtonColorType;
  size?: ButtonSizeType;
  disabled?: boolean;
  loading?: boolean;
  loadingColor?: string;
  loadingElement?: JSX.Element;
  text?: string | JSX.Element;
  borderRadius?: number;
  startElement?: JSX.Element;
  endElement?: JSX.Element;
  style?: StyleProp<Omit<ViewStyle, 'borderRadius' | 'padding'>>;
  styles?: Styles;
  onPress?: TouchableHighlightProps['onPress'];
  activeOpacity?: TouchableHighlightProps['activeOpacity'];
  touchableHighlightProps?: Omit<
    TouchableHighlightProps,
    'onPress' | 'activeOpacity' | 'style'
  >;
  hitSlop?: null | Insets | number | undefined;
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
  type: ButtonType;
  size?: ButtonSizeType;
  outlined?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

const ButtonContainer = styled.View<ButtonContainerStyleProps>`
  align-self: stretch;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

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
      : size === 'large'
        ? '16px 32px'
        : size === 'small'
          ? '8px 16px'
          : '12px 24px';

  return {
    container: [
      css`
        border-radius: ${borderRadius + 'px'};
        padding: ${padding};
        background-color: ${isDisabled
          ? theme.button.disabled.bg
          : ['text', 'outlined'].includes(type)
            ? theme.bg.basic
            : theme.button[color].bg};
        border-color: ${isDisabled
          ? theme.bg.disabled
          : type === 'text'
            ? 'transparent'
            : theme.button[color].bg};
        border-width: ${type !== 'text' ? '1px' : 0};
      `,
      styles?.container,
    ],
    text: [
      css`
        font-family: 'Pretendard';
        color: ${isDisabled
          ? theme.button.disabled.text
          : type === 'solid' || color === 'light'
            ? theme.button[color].text
            : theme.button[color].bg};
      `,
      styles?.text,
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
    hovered: hovered
      ? [
          {
            shadowColor: 'black',
            shadowOpacity: 0.24,
            shadowRadius: 16,
            elevation: 10,
          },
          css`
            border-radius: ${borderRadius + 'px'};
          `,
          styles?.hovered,
        ]
      : undefined,
    disabled: isDisabled
      ? [
          css`
            background-color: ${theme.button.disabled.bg};
            border-color: ${theme.bg.disabled};
          `,
          styles?.disabled,
        ]
      : undefined,
  };
};

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
  return {
    innerDisabled: disabled || !onPress,
    isLoading: loading,
  };
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
}: Props): JSX.Element {
  const ref = useRef<React.ElementRef<typeof TouchableHighlight>>(null);
  const hovered = useHover(ref);
  const {theme} = useTheme();

  const {innerDisabled} = useButtonState({disabled, onPress, loading});
  const compositeStyles: Styles = calculateStyles({
    theme,
    type,
    color,
    size,
    loading,
    disabled: innerDisabled,
    borderRadius,
    hovered,
    styles,
  });

  const LoadingView = loadingElement ?? (
    <LoadingIndicator
      color={
        loadingColor || type === 'solid'
          ? theme.text.contrast
          : theme.text.basic
      }
      size="small"
    />
  );

  const renderContainer = useCallback(
    ({
      children,
      loadingView,
    }: {
      children: JSX.Element;
      loadingView: JSX.Element;
    }): JSX.Element => (
      <ButtonContainer
        disabled={innerDisabled}
        size={size}
        style={[
          compositeStyles.container,
          hovered && !innerDisabled && compositeStyles.hovered,
          innerDisabled && compositeStyles.disabled,
          type === 'text' &&
            css`
              background-color: transparent;
            `,
        ]}
        testID={loading ? 'loading-view' : 'button-container'}
        type={type}
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

  const ChildView = (
    <>
      {cloneElemWithDefaultColors({
        element: startElement,
        backgroundColor: compositeStyles.container?.[0]?.backgroundColor,
        color: compositeStyles.text?.[0]?.color,
      })}
      {!text || typeof text === 'string' ? (
        <Text style={compositeStyles.text}>{text}</Text>
      ) : (
        text
      )}
      {cloneElemWithDefaultColors({
        element: endElement,
        backgroundColor: compositeStyles.container?.[0]?.backgroundColor,
        color: compositeStyles.text?.[0]?.color,
      })}
    </>
  );

  return (
    <TouchableHighlight
      activeOpacity={activeOpacity}
      delayPressIn={30}
      disabled={innerDisabled || loading || !onPress}
      hitSlop={hitSlop}
      onPress={onPress}
      ref={Platform.select({
        web: ref,
        default: undefined,
      })}
      style={[
        style,
        css`
          border-radius: ${borderRadius + 'px'};
        `,
      ]}
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
