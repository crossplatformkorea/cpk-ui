import React, {useCallback, useEffect, useMemo, useRef, useState, type ReactElement} from 'react';
import type {
  LayoutRectangle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {Animated, Platform, TouchableOpacity, View} from 'react-native';
import {styled, css} from 'kstyled';

import {
  ColoredText,
  RadioButtonWrapper,
  RadioWrapper,
} from '../Styled/StyledComponents';

import type {RadioButtonType} from './RadioGroup';

export type RadioButtonSizeType = 'small' | 'medium' | 'large' | number;

export type RadioButtonStyles = {
  container?: StyleProp<ViewStyle>;
  label?: StyleProp<TextStyle>;
  circleWrapper?: StyleProp<ViewStyle>;
  circle?: StyleProp<ViewStyle>;
};

export type RadioButtonProps = {
  testID?: string;
  onPress?: () => void;
  label?: string;
  labelPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  styles?: RadioButtonStyles;
  type?: RadioButtonType;
  size?: RadioButtonSizeType;
  disabled?: boolean;
  selected?: boolean;
  endElement?: ReactElement;
  startElement?: ReactElement;
  accessibilityLabel?: string;
};

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const StyledRadioCircle = Animated.createAnimatedComponent(RadioWrapper);

export default function RadioButton({
  testID,
  style,
  styles,
  endElement,
  startElement,
  type = 'primary',
  size = 'medium',
  disabled = false,
  selected,
  onPress,
  label,
  labelPosition = 'right',
  accessibilityLabel,
}: RadioButtonProps): ReactElement {
  const [innerLayout, setInnerLayout] = useState<LayoutRectangle>();
  const fadeAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  // Memoize layout handler
  const handleLayout = useCallback((e: any) => {
    setInnerLayout(e.nativeEvent.layout);
  }, []);

  // Memoize animation config
  const animationConfig = useMemo(
    () => ({
      useNativeDriver: Platform.select({
        web: false,
        default: true,
      }),
    }),
    []
  );

  useEffect(() => {
    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: !selected ? 0 : 1,
        ...animationConfig,
      }),
      Animated.spring(scaleAnim, {
        toValue: !selected ? 0 : 1,
        ...animationConfig,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, selected, animationConfig]);

  // Memoize container styles
  const containerStyles = useMemo(
    () => [
      css`
        padding-top: 6;
        padding-bottom: 6;
        padding-left: ${startElement || (label && labelPosition === 'left')
          ? 8
          : 0};
        padding-right: ${endElement || (label && labelPosition === 'right')
          ? 8
          : 0};

        flex-direction: row;
        align-items: center;
      `,
      styles?.container,
    ],
    [startElement, endElement, label, labelPosition, styles?.container]
  );

  // Memoize animated styles with margin and borderRadius
  const animatedStyles = useMemo(
    () => [
      styles?.circle,
      {
        margin: innerLayout ? 2 : 0,
        borderRadius: innerLayout ? innerLayout.width / 2 : 0,
        opacity: fadeAnim,
        transform: [{scale: scaleAnim}],
      },
    ],
    [innerLayout, styles?.circle, fadeAnim, scaleAnim]
  );

  return (
    <Container
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="radio"
      accessibilityState={{selected, disabled}}
      activeOpacity={0.9}
      disabled={disabled}
      onPress={onPress}
      style={style}
      testID={testID}
    >
      <View style={containerStyles}>
        {startElement}
        {label && labelPosition === 'left' ? (
          <ColoredText
            $disabled={!!disabled}
            $selected={!!selected}
            $size={size}
            style={styles?.label}
            $type={type}
          >
            {label}
          </ColoredText>
        ) : null}
        <RadioButtonWrapper
          $disabled={disabled}
          $selected={!!selected}
          $size={size}
          style={styles?.circleWrapper}
          $type={type}
        >
          <StyledRadioCircle
            $disabled={!!disabled}
            onLayout={handleLayout}
            $selected={!!selected}
            style={animatedStyles}
            testID={`circle-${testID}`}
            $type={type}
          />
        </RadioButtonWrapper>
        {label && labelPosition === 'right' ? (
          <ColoredText
            $disabled={!!disabled}
            $selected={!!selected}
            $size={size}
            style={styles?.label}
            $type={type}
          >
            {label}
          </ColoredText>
        ) : null}
        {endElement}
      </View>
    </Container>
  );
}

// Export memoized component for better performance
const MemoizedRadioButton = React.memo(RadioButton);
export {MemoizedRadioButton as RadioButton};
