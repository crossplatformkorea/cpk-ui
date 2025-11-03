import React, {
  cloneElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
  useMemo,
  type ReactElement,
} from 'react';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {styled, css} from 'kstyled';
import {useTheme} from '../../../providers/ThemeProvider';
import {Typography} from '../../uis/Typography/Typography';
import {Button} from '../../uis/Button/Button';
import {Icon} from '../../uis/Icon/Icon';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;

  flex-direction: row;
`;

const AlertDialogContainer = styled.View<{$size?: AlertDialogSizeType}>`
  flex: 0.87;
  background-color: ${({theme}) => theme.bg.basic};
  padding-top: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 1.25;
    return $size === 'small' ? 16 : $size === 'large' ? 24 : 20;
  }};
  padding-right: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 1.25;
    return $size === 'small' ? 16 : $size === 'large' ? 24 : 20;
  }};
  padding-bottom: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 1.75;
    return $size === 'small' ? 22 : $size === 'large' ? 32 : 28;
  }};
  padding-left: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 1.5;
    return $size === 'small' ? 18 : $size === 'large' ? 28 : 24;
  }};
  border-radius: 8px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BodyRow = styled.View<{$marginTop: number; $marginBottom: number}>`
  margin-top: ${({$marginTop}) => $marginTop};
  margin-bottom: ${({$marginBottom}) => $marginBottom};
`;

const ActionRow = styled.View<{$marginTop: number}>`
  margin-top: ${({$marginTop}) => $marginTop};
  padding-right: 4px;
  flex-direction: row;
`;

export type AlertDialogSizeType = 'small' | 'medium' | 'large' | number;

export type AlertDialogProps = {
  style?: StyleProp<ViewStyle>;
};

export type AlertDialogStyles = {
  container?: StyleProp<ViewStyle>;
  titleContainer?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  bodyContainer?: StyleProp<ViewStyle>;
  body?: StyleProp<TextStyle>;
  actionContainer?: StyleProp<ViewStyle>;
};

export type AlertDialogOptions = {
  styles?: AlertDialogStyles;
  title?: string | ReactElement;
  body?: string | ReactElement;
  backdropOpacity?: number;
  closeOnTouchOutside?: boolean;
  actions?: ReactElement[];
  showCloseButton?: boolean;
  size?: AlertDialogSizeType;
};

export type AlertDialogContext = {
  open(alertDialogOptions?: AlertDialogOptions): void;
  close(): void;
};

function AlertDialog(
  {style}: AlertDialogProps,
  ref: React.Ref<AlertDialogContext>,
): ReactElement {
  const [options, setOptions] = useState<AlertDialogOptions | null>(null);
  const [visible, setVisible] = useState(false);
  const {theme, themeType} = useTheme();

  // Memoize the cleanup effect
  useEffect(() => {
    if (!visible) {
      const timeoutId = setTimeout(() => {
        setOptions(null);
        // Run after modal has finished transition
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
    
    // Return an empty cleanup function when visible is true
    return () => {};
  }, [visible]);

  // Memoize the close handler
  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  // Memoize the open handler
  const handleOpen = useCallback((alertDialogOptions?: AlertDialogOptions) => {
    setVisible(true);
    if (alertDialogOptions) {
      setOptions(alertDialogOptions);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: handleClose,
  }), [handleOpen, handleClose]);

  const {
    backdropOpacity = 0.2,
    title,
    body,
    styles,
    actions,
    closeOnTouchOutside = true,
    showCloseButton = true,
    size = 'medium',
  } = options ?? {};

  // Calculate sizes based on size prop
  const sizeConfig = useMemo(() => {
    if (typeof size === 'number') {
      return {
        titleFontSize: size,
        bodyFontSize: size * 0.875,
        iconSize: size * 1.125,
        actionMarginTop: size * 1.25,
        bodyMarginTop: size * 0.75,
        bodyMarginBottom: size * 0.5,
      };
    }

    switch (size) {
      case 'small':
        return {
          titleFontSize: 14,
          bodyFontSize: 12,
          iconSize: 16,
          actionMarginTop: 16,
          bodyMarginTop: 10,
          bodyMarginBottom: 6,
        };
      case 'large':
        return {
          titleFontSize: 18,
          bodyFontSize: 16,
          iconSize: 20,
          actionMarginTop: 24,
          bodyMarginTop: 14,
          bodyMarginBottom: 10,
        };
      default: // 'medium'
        return {
          titleFontSize: 16,
          bodyFontSize: 14,
          iconSize: 18,
          actionMarginTop: 20,
          bodyMarginTop: 12,
          bodyMarginBottom: 8,
        };
    }
  }, [size]);

  // Memoize backdrop color calculation
  const backdropColor = useMemo(() => 
    themeType === 'light'
      ? `rgba(0,0,0,${backdropOpacity})`
      : `rgba(255,255,255,${backdropOpacity})`,
    [themeType, backdropOpacity]
  );

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

  // Memoize backdrop press handler
  const handleBackdropPress = useCallback(() => {
    if (closeOnTouchOutside) {
      setVisible(false);
    }
  }, [closeOnTouchOutside]);

  // Memoize close button press handler
  const handleCloseButtonPress = useCallback(() => setVisible(false), []);

  // Memoize title content
  const titleContent = useMemo(() =>
    typeof title === 'string' ? (
      <Typography.Heading3 style={[{fontSize: sizeConfig.titleFontSize}, styles?.title]}>
        {title}
      </Typography.Heading3>
    ) : (
      title
    ),
    [title, sizeConfig.titleFontSize, styles?.title]
  );

  // Memoize body content
  const bodyContent = useMemo(() =>
    typeof body === 'string' ? (
      <Typography.Body3 style={[{fontSize: sizeConfig.bodyFontSize}, styles?.body]}>{body}</Typography.Body3>
    ) : (
      body
    ),
    [body, sizeConfig.bodyFontSize, styles?.body]
  );

  // Memoize actions content
  const actionsContent = useMemo(() =>
    actions ? (
      <ActionRow $marginTop={sizeConfig.actionMarginTop} style={styles?.actionContainer}>
        {actions.map((action, index) =>
          cloneElement(action, {
            key: `action-${index}`,
            style: {
              flex: 1,
              marginLeft: index !== 0 ? 12 : 0,
            },
          } as any),
        )}
      </ActionRow>
    ) : null,
    [actions, sizeConfig.actionMarginTop, styles?.actionContainer]
  );

  // Memoize close button content
  const closeButtonContent = useMemo(() =>
    showCloseButton ? (
      <Button
        onPress={handleCloseButtonPress}
        borderRadius={24}
        text={<Icon color={theme.text.basic} name="X" size={sizeConfig.iconSize} />}
        type="text"
      />
    ) : null,
    [showCloseButton, handleCloseButtonPress, sizeConfig.iconSize, theme.text.basic]
  );

  const AlertDialogContent = useMemo(() => (
    <Container
      style={css`
        background-color: ${backdropColor};
      `}
    >
      <TouchableWithoutFeedback
        onPress={closeOnTouchOutside ? handleCloseButtonPress : undefined}
      >
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>
      
      <AlertDialogContainer
        $size={size}
        accessibilityRole="alert"
        accessibilityLabel={typeof title === 'string' ? title : 'Alert dialog'}
        style={containerStyles}
      >
        <TitleRow style={styles?.titleContainer}>
          {titleContent}
          {closeButtonContent}
        </TitleRow>
        <BodyRow $marginTop={sizeConfig.bodyMarginTop} $marginBottom={sizeConfig.bodyMarginBottom} style={styles?.bodyContainer}>
          {bodyContent}
        </BodyRow>
        {actionsContent}
      </AlertDialogContainer>
    </Container>
  ), [
    backdropColor,
    closeOnTouchOutside,
    handleCloseButtonPress,
    title,
    size,
    containerStyles,
    styles?.titleContainer,
    styles?.bodyContainer,
    sizeConfig.bodyMarginTop,
    sizeConfig.bodyMarginBottom,
    titleContent,
    closeButtonContent,
    bodyContent,
    actionsContent,
  ]);

  return (
    // https://github.com/facebook/react-native/issues/48526#issuecomment-2579478884
    <View style={style}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
      >
        {closeOnTouchOutside ? (
          <TouchableWithoutFeedback
            onPress={handleBackdropPress}
            style={css`
              flex: 1;
            `}
          >
            {AlertDialogContent}
          </TouchableWithoutFeedback>
        ) : (
          AlertDialogContent
        )}
      </Modal>
    </View>
  );
}

// Export memoized component for better performance
export default React.memo(forwardRef<AlertDialogContext, AlertDialogProps>(AlertDialog));
