import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {Animated, Platform, TouchableOpacity, View} from 'react-native';
import {styled, css} from 'kstyled';

import {
  CheckboxWrapper,
  CheckboxWrapperOutlined,
} from '../Styled/StyledComponents';
import {Icon} from '../Icon/Icon';
import {useTheme} from '../../../providers/ThemeProvider';

type Styles = {
  container?: StyleProp<ViewStyle>;
  checkbox?: StyleProp<ViewStyle>;
  check?: ViewStyle;
};

export type CheckboxColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

export interface CheckboxProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  styles?: Styles;
  color?: CheckboxColor;
  disabled?: boolean;
  checked?: boolean;
  endElement?: React.JSX.Element;
  startElement?: React.JSX.Element;
}

const Container = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`;

const StyledCheckboxOutlined = styled(CheckboxWrapperOutlined)`
  width: 20px;
  height: 20px;
  border-width: 1px;
  margin: 0 6px;

  justify-content: center;
  align-items: center;
`;

// Create animated version for checkbox that needs animation
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedCheckbox = styled(AnimatedView)`
  width: 20px;
  height: 20px;
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
  endElement,
  startElement,
  color = 'primary',
  disabled = false,
  checked = false,
  onPress,
}: CheckboxProps): React.JSX.Element {
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

        flex-direction: row;
        column-gap: 2px;
        align-items: center;
      `,
      styles?.container,
    ],
    [styles?.container],
  );

  // Memoize animated styles
  const animatedStyles = useMemo(
    () => [
      styles?.checkbox,
      {
        opacity: fadeAnim,
        transform: [{scale: scaleAnim}],
      },
    ],
    [styles?.checkbox, fadeAnim, scaleAnim],
  );

  return (
    <Container
      activeOpacity={0.9}
      disabled={disabled}
      onPress={onPress}
      style={style}
    >
      <View style={containerStyles}>
        {startElement}
        <StyledCheckboxOutlined
          $checked={checked}
          $disabled={disabled}
          style={styles?.checkbox}
          testID="cpk-ui-checkbox"
          $type={color}
        >
          <AnimatedCheckbox style={animatedStyles}>
            <StyledCheck
              $checked={checked}
              name="Check"
              style={styles?.check}
            />
          </AnimatedCheckbox>
        </StyledCheckboxOutlined>
        {endElement}
      </View>
    </Container>
  );
}

// Export memoized component for better performance
export default React.memo(Checkbox) as typeof Checkbox;
