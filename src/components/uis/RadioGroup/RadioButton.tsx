import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {
  LayoutRectangle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {Animated, Platform, View} from 'react-native';
import styled, {css} from '@emotion/native';

import {
  ColoredText,
  RadioButtonWrapper,
  RadioWrapper,
} from '../Styled/StyledComponents';

import type {RadioButtonType} from './RadioGroup';

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
  disabled?: boolean;
  selected?: boolean;
  endElement?: React.JSX.Element;
  startElement?: React.JSX.Element;
};

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const StyledRadioButton = styled(RadioButtonWrapper)<{
  selected?: boolean;
  disabled?: boolean;
  type?: RadioButtonType;
}>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 1px;
  margin: 0 6px;

  justify-content: center;
  align-items: center;
`;

const StyledRadioCircle = styled(RadioWrapper)<{
  selected?: boolean;
  disabled?: boolean;
  innerLayout?: LayoutRectangle;
}>`
  flex: 1;
  align-self: stretch;

  margin: ${({innerLayout}) => innerLayout && '2px'};
  border-radius: ${({innerLayout}) =>
    innerLayout && `${innerLayout.width / 2 + 'px'}`};
`;

export default function RadioButton({
  testID,
  style,
  styles,
  endElement,
  startElement,
  type = 'primary',
  disabled = false,
  selected,
  onPress,
  label,
  labelPosition = 'right',
}: RadioButtonProps): React.JSX.Element {
  const [innerLayout, setInnerLayout] = useState<LayoutRectangle>();
  const animatedValue = new Animated.Value(0);
  const fadeAnim = useRef(animatedValue).current;
  const scaleAnim = useRef(animatedValue).current;

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
    Animated.sequence([
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
        padding-top: 6px;
        padding-bottom: 6px;
        padding-left: ${startElement || (label && labelPosition === 'left')
          ? '8px'
          : 0};
        padding-right: ${endElement || (label && labelPosition === 'right')
          ? '8px'
          : 0};

        flex-direction: row;
        align-items: center;
      `,
      styles?.container,
    ],
    [startElement, endElement, label, labelPosition, styles?.container]
  );

  // Memoize animated styles
  const animatedStyles = useMemo(
    () => [
      styles?.circle,
      {
        opacity: fadeAnim,
        transform: [{scale: scaleAnim}],
      },
    ],
    [styles?.circle, fadeAnim, scaleAnim]
  );

  return (
    <Container
      activeOpacity={0.9}
      disabled={disabled}
      onPress={onPress}
      style={style}
      testID={testID}
    >
      <View style={containerStyles}>
        <>
          {startElement}
          {label && labelPosition === 'left' ? (
            <ColoredText
              disabled={!!disabled}
              selected={!!selected}
              style={styles?.label}
              type={type}
            >
              {label}
            </ColoredText>
          ) : null}
          <StyledRadioButton
            disabled={disabled}
            selected={!!selected}
            style={styles?.circleWrapper}
            type={type}
          >
            <StyledRadioCircle
              disabled={!!disabled}
              innerLayout={innerLayout}
              onLayout={handleLayout}
              selected={!!selected}
              style={animatedStyles}
              testID={`circle-${testID}`}
              type={type}
            />
          </StyledRadioButton>
          {label && labelPosition === 'right' ? (
            <ColoredText
              disabled={!!disabled}
              selected={!!selected}
              style={styles?.label}
              type={type}
            >
              {label}
            </ColoredText>
          ) : null}
          {endElement}
        </>
      </View>
    </Container>
  );
}

// Export memoized component for better performance
const MemoizedRadioButton = React.memo(RadioButton);
export {MemoizedRadioButton as RadioButton};
