import React, {
  cloneElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styled, {css} from '@emotion/native';
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

const AlertDialogContainer = styled.View`
  flex: 0.87;
  background-color: ${({theme}) => theme.bg.basic};
  padding: 20px 20px 28px 24px;
  border-radius: 8px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BodyRow = styled.View`
  margin-top: 12px;
  margin-bottom: 8px;
`;

const ActionRow = styled.View`
  margin-top: 20px;
  padding-right: 4px;
  flex-direction: row;
`;

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
  title?: string | React.JSX.Element;
  body?: string | React.JSX.Element;
  backdropOpacity?: number;
  closeOnTouchOutside?: boolean;
  actions?: React.JSX.Element[];
  showCloseButton?: boolean;
};

export type AlertDialogContext = {
  open(alertDialogOptions?: AlertDialogOptions): void;
  close(): void;
};

function AlertDialog(
  {style}: AlertDialogProps,
  ref: React.Ref<AlertDialogContext>,
): React.JSX.Element {
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
  } = options ?? {};

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

  // Memoize modal styles
  const modalStyles = useMemo(() => [
    css`
      flex: 1;
      align-self: stretch;
    `,
    style,
  ], [style]);

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
      <Typography.Heading3 style={styles?.title}>
        {title}
      </Typography.Heading3>
    ) : (
      title
    ),
    [title, styles?.title]
  );

  // Memoize body content
  const bodyContent = useMemo(() => 
    typeof body === 'string' ? (
      <Typography.Body3 style={styles?.body}>{body}</Typography.Body3>
    ) : (
      body
    ),
    [body, styles?.body]
  );

  // Memoize actions content
  const actionsContent = useMemo(() => 
    actions ? (
      <ActionRow style={styles?.actionContainer}>
        {actions.map((action, index) =>
          cloneElement(action, {
            key: `action-${index}`,
            style: {
              flex: 1,
              marginLeft: index !== 0 ? 12 : 0,
            },
          }),
        )}
      </ActionRow>
    ) : null,
    [actions, styles?.actionContainer]
  );

  // Memoize close button content
  const closeButtonContent = useMemo(() => 
    showCloseButton ? (
      <Button
        onPress={handleCloseButtonPress}
        borderRadius={24}
        text={<Icon color={theme.text.basic} name="X" size={18} />}
        type="text"
      />
    ) : null,
    [showCloseButton, handleCloseButtonPress, theme.text.basic]
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
        accessibilityRole="alert"
        accessibilityLabel={typeof title === 'string' ? title : 'Alert dialog'}
        style={containerStyles}
      >
        <TitleRow style={styles?.titleContainer}>
          {titleContent}
          {closeButtonContent}
        </TitleRow>
        <BodyRow style={styles?.bodyContainer}>
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
    containerStyles,
    styles?.titleContainer,
    styles?.bodyContainer,
    titleContent,
    closeButtonContent,
    bodyContent,
    actionsContent,
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
