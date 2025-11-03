import React, {forwardRef, useImperativeHandle, useState, useCallback, useMemo, type ReactElement} from 'react';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {Modal, Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {styled, css} from 'kstyled';

import {SnackbarTimer} from './const';
import {Button, ButtonColorType} from '../../uis/Button/Button';
import {useTheme} from '../../../providers/ThemeProvider';
import {Icon} from '../../uis/Icon/Icon';
import {Typography} from '../../uis/Typography/Typography';

const Container = styled(View)`
  flex: 1;
  align-self: stretch;

  flex-direction: row;
  justify-content: center;
`;

const SnackbarContainer = styled(SafeAreaView)<{$color: ButtonColorType; $size?: SnackbarSizeType}>`
  background-color: ${({theme, $color}) => theme.button[$color].bg};
  border-radius: 8px;
  margin-bottom: 52px;
  margin-left: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 0.75;
    return $size === 'small' ? 10 : $size === 'large' ? 14 : 12;
  }};
  margin-right: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 0.75;
    return $size === 'small' ? 10 : $size === 'large' ? 14 : 12;
  }};
  align-self: flex-end;

  flex-direction: row;
  align-items: center;
`;

const ActionContainer = styled(View)`
  margin-right: 4px;
`;

const SnackbarText = styled(Typography.Body2)<{$color: ButtonColorType; $size?: SnackbarSizeType}>`
  color: ${({theme, $color}) => theme.button[$color].text};
  flex: 1;
  padding: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 0.75;
    return $size === 'small' ? 10 : $size === 'large' ? 14 : 12;
  }};
`;

export type SnackbarSizeType = 'small' | 'medium' | 'large' | number;

export type SnackbarProps = {
  style?: StyleProp<ViewStyle>;
};

export type SnackbarStyles = {
  container?: StyleProp<ViewStyle>;
  text?: StyleProp<TextStyle>;
  actionContainer?: StyleProp<ViewStyle>;
  actionText?: StyleProp<TextStyle>;
};

export type SnackbarOptions = {
  color?: ButtonColorType;
  styles?: SnackbarStyles;
  text?: string;
  actionText?: string;
  timer?: SnackbarTimer | number;
  size?: SnackbarSizeType;
};

export type SnackbarContext = {
  open(snackbarOptions?: SnackbarOptions): void;
  close(): void;
};

let timer: NodeJS.Timeout | null = null;

function clearTimer(): void {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function Snackbar(
  {style}: SnackbarProps,
  ref: React.Ref<SnackbarContext>,
): ReactElement {
  const [options, setOptions] = useState<SnackbarOptions | null>(null);
  const [visible, setVisible] = useState(false);
  const {theme} = useTheme();

  // Memoize the close handler
  const handleClose = useCallback(() => {
    setVisible(false);
    setOptions(null);
  }, []);

  // Memoize the open handler
  const handleOpen = useCallback((snackbarOptions?: SnackbarOptions) => {
    clearTimer();
    setVisible(true);
    if (snackbarOptions) {
      setOptions(snackbarOptions);
    }

    timer = setTimeout(() => {
      setVisible(false);
      clearTimer();
    }, snackbarOptions?.timer ?? SnackbarTimer.SHORT);
  }, []);

  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: handleClose,
  }), [handleOpen, handleClose]);

  const {text, styles, actionText, color = 'primary', size = 'medium'} = options ?? {};

  // Calculate sizes based on size prop
  const sizeConfig = useMemo(() => {
    if (typeof size === 'number') {
      return {
        fontSize: size,
        iconSize: size,
      };
    }

    switch (size) {
      case 'small':
        return {
          fontSize: 12,
          iconSize: 14,
        };
      case 'large':
        return {
          fontSize: 16,
          iconSize: 18,
        };
      default: // 'medium'
        return {
          fontSize: 14,
          iconSize: 16,
        };
    }
  }, [size]);

  // Memoize shadow styles
  const shadowStyles = useMemo(() => 
    Platform.OS !== 'web' ? {
      shadowOffset: {width: 0, height: 4},
      shadowColor: theme.text.basic,
    } : {},
    [theme.text.basic]
  );

  // Memoize container styles
  const containerStyles = useMemo(() => 
    StyleSheet.flatten([shadowStyles, styles?.container]),
    [shadowStyles, styles?.container]
  );

  // Memoize text styles
  const textStyles = useMemo(() =>
    StyleSheet.flatten([
      css`
        color: ${theme.button[color].text};
        font-size: ${sizeConfig.fontSize}px;
      `,
      styles?.text,
    ]),
    [theme.button, color, sizeConfig.fontSize, styles?.text]
  );

  // Memoize action text styles
  const actionTextStyles = useMemo(() => 
    StyleSheet.flatten([
      css`
        color: ${theme.button[color].text};
      `,
      styles?.actionText,
    ]),
    [theme.button, color, styles?.actionText]
  );

  // Memoize action button handler
  const handleActionPress = useCallback(() => setVisible(false), []);

  // Memoize modal styles
  const modalStyles = useMemo(() => [
    css`
      flex: 1;
      align-self: stretch;
    `,
    style,
  ], [style]);

  const SnackbarContent = useMemo(() => (
    <Container>
      <SnackbarContainer
        $color={color}
        $size={size}
        style={containerStyles}
      >
        <SnackbarText
          $color={color}
          $size={size}
          style={textStyles}
        >
          {text}
        </SnackbarText>
        <ActionContainer style={styles?.actionContainer}>
          {actionText ? (
            <Button
              onPress={handleActionPress}
              styles={{
                text: actionTextStyles,
              }}
              text={actionText}
              type="text"
            />
          ) : (
            <Button
              onPress={handleActionPress}
              text={<Icon color={theme.button[color].text} name="X" size={sizeConfig.iconSize} />}
              type="text"
            />
          )}
        </ActionContainer>
      </SnackbarContainer>
    </Container>
  ), [
    color,
    size,
    containerStyles,
    textStyles,
    text,
    styles?.actionContainer,
    actionText,
    actionTextStyles,
    handleActionPress,
    sizeConfig.iconSize,
    theme.button,
  ]);

  return (
    // https://github.com/facebook/react-native/issues/48526#issuecomment-2579478884
    <View>
      <Modal
        animationType="fade"
        style={modalStyles}
        transparent={true}
        visible={visible}
      >
        {SnackbarContent}
      </Modal>
    </View>
  );
}

// Export memoized component for better performance
export default React.memo(forwardRef<SnackbarContext, SnackbarProps>(Snackbar));
