import React, {useCallback, useEffect, useMemo, useRef, type ReactElement} from 'react';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {Animated, Platform, TouchableOpacity, View} from 'react-native';
import {styled, css} from 'kstyled';

import {
  CheckboxWrapper,
  CheckboxWrapperOutlined,
} from '../Styled/StyledComponents';
import {Icon} from '../Icon/Icon';
import {Typography} from '../Typography/Typography';
import {useTheme} from '../../../providers/ThemeProvider';

type Styles = {
  container?: StyleProp<ViewStyle>;
  checkbox?: StyleProp<ViewStyle>;
  check?: ViewStyle;
  text?: StyleProp<TextStyle>;
};

export type CheckboxColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

export type CheckboxSizeType = 'small' | 'medium' | 'large' | number;

export interface CheckboxProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  styles?: Styles;
  color?: CheckboxColor;
  size?: CheckboxSizeType;
  disabled?: boolean;
  checked?: boolean;
  text?: string | ReactElement;
  direction?: 'left' | 'right';
  accessibilityLabel?: string;
}

const Container = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`;

const StyledCheckboxOutlined = styled(CheckboxWrapperOutlined)`
  border-width: 1px;
  margin: 0 6px;

  justify-content: center;
  align-items: center;
`;

// Create animated version for checkbox that needs animation
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedCheckbox = styled(AnimatedView)`
  margin: 0 6px;

  justify-content: center;
  align-items: center;
`;

const StyledCheck = styled(Icon)<{$checked?: boolean}>`
  font-weight: bold;
  color: ${({theme, $checked}) => ($checked ? theme.bg.basic : 'transparent')};
`;

export function Checkbox({
  style,
  styles,
  text,
  direction = 'right',
  color = 'primary',
  size = 'medium',
  disabled = false,
  checked = false,
  onPress,
  accessibilityLabel,
}: CheckboxProps): ReactElement {
  const checkboxSize = typeof size === 'number'
    ? size
    : size === 'small'
      ? 16
      : size === 'large'
        ? 24
        : 20;

  const textFontSize = typeof size === 'number'
    ? size * 0.7
    : size === 'small'
      ? 12
      : size === 'large'
        ? 16
        : 14;
  // Separate animated values for fade and scale
  const fadeAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(checked ? 1 : 0.8)).current; // Start from 0.8, not 0
  const {theme} = useTheme();

  // Memoize animation config
  const animationConfig = useMemo(
    () => ({
      useNativeDriver: Platform.select({
        web: false,
        default: true,
      }),
    }),
    [],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: checked ? 1 : 0,
        ...animationConfig,
      }),
      Animated.spring(scaleAnim, {
        toValue: checked ? 1 : 0.8, // Scale to 0.8 when unchecked, not 0
        ...animationConfig,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, checked, animationConfig]);

  // Memoize container styles
  const containerStyles = useMemo(
    () => [
      css`
        flex: 1;
        padding: 6px 0;

        flex-direction: ${direction === 'left' ? 'row-reverse' : 'row'};
        column-gap: 2px;
        align-items: center;
      `,
      styles?.container,
    ],
    [styles?.container, direction],
  );

  // Memoize checkbox size styles
  const checkboxSizeStyles = useMemo(
    () => ({
      width: checkboxSize,
      height: checkboxSize,
    }),
    [checkboxSize],
  );

  // Memoize animated styles
  const animatedStyles = useMemo(
    () => [
      checkboxSizeStyles,
      styles?.checkbox,
      {
        opacity: fadeAnim,
        transform: [{scale: scaleAnim}],
      },
    ],
    [checkboxSizeStyles, styles?.checkbox, fadeAnim, scaleAnim],
  );

  // Memoize text styles
  const textStyles = useMemo(
    () => [
      css`
        font-size: ${textFontSize}px;
      `,
      styles?.text,
    ],
    [textFontSize, styles?.text],
  );

  // Render text element
  const TextElement = useMemo(() => {
    if (!text) return null;

    if (typeof text === 'string') {
      return (
        <Typography.Body2 style={textStyles}>
          {text}
        </Typography.Body2>
      );
    }

    return text;
  }, [text, textStyles]);

  return (
    <Container
      accessibilityLabel={accessibilityLabel ?? (typeof text === 'string' ? text : undefined)}
      accessibilityRole="checkbox"
      accessibilityState={{checked, disabled}}
      activeOpacity={0.9}
      disabled={disabled}
      onPress={onPress}
      style={style}
    >
      <View style={containerStyles}>
        <StyledCheckboxOutlined
          $checked={checked}
          $disabled={disabled}
          style={[checkboxSizeStyles, styles?.checkbox]}
          testID="cpk-ui-checkbox"
          $type={color}
        >
          <AnimatedCheckbox style={animatedStyles}>
            <StyledCheck
              $checked={checked}
              name="Check"
              size={checkboxSize * 0.7}
              style={styles?.check}
            />
          </AnimatedCheckbox>
        </StyledCheckboxOutlined>
        {TextElement}
      </View>
    </Container>
  );
}

// Export memoized component for better performance
export default React.memo(Checkbox) as typeof Checkbox;
