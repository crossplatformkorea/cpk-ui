import React, {useCallback, useEffect, useMemo, useState, type ReactElement} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {Animated, TouchableOpacity, View} from 'react-native';
import {styled} from 'kstyled';
import {useTheme} from '../../../providers/ThemeProvider';

// Metro cache workaround: Using explicit pattern until cache is cleared
const AnimatedView = Animated.createAnimatedComponent(View);

type Styles = {
  container?: ViewStyle;
  onElementContainer?: StyleProp<ViewStyle>;
  offElementContainer?: StyleProp<ViewStyle>;
  circle?: ViewStyle;
  button?: StyleProp<ViewStyle>;
  circleColorOff?: string;
  circleColorOn?: string;
  backgroundColorOn?: string;
  backgroundColorOff?: string;
};

export type SwitchToggleSizeType = 'small' | 'medium' | 'large' | number;

type Props = {
  testID?: string;
  size?: SwitchToggleSizeType;
  isOn: boolean;
  style?: StyleProp<ViewStyle>;
  styles?: Styles;
  duration?: number;
  onElement?: any;
  offElement?: any;
  onPress?: () => void;
};

// Using AnimatedView created above - functionally identical to styled(Animated.View)
const AnimatedContainer = styled(AnimatedView)`
  flex-direction: row;
  align-items: center;
`;

const smallContainer: ViewStyle = {
  width: 40,
  height: 24,
  borderRadius: 25,
  padding: 5,
};

const smallCircle: ViewStyle = {
  width: 16,
  height: 16,
  borderRadius: 8,
};

const mediumContainer: ViewStyle = {
  width: 56,
  height: 30,
  borderRadius: 25,
  padding: 5,
};

const mediumCircle: ViewStyle = {
  width: 20,
  height: 20,
  borderRadius: 10,
};

const largeContainer: ViewStyle = {
  width: 80,
  height: 40,
  borderRadius: 25,
  padding: 5,
};

const largeCircle: ViewStyle = {
  width: 32,
  height: 32,
  borderRadius: 16,
};

export function SwitchToggle({
  testID,
  isOn,
  style,
  styles,
  duration = 300,
  onElement,
  size = 'medium',
  offElement,
  onPress,
}: Props): ReactElement {
  const {theme} = useTheme();

  // Memoize size-based configurations
  const sizeConfig = useMemo(() => {
    if (typeof size === 'number') {
      const containerConfig: ViewStyle = {
        width: size * 1.87,
        height: size,
        borderRadius: size / 2,
        padding: size * 0.17,
      };
      const circleConfig: ViewStyle = {
        width: size * 0.67,
        height: size * 0.67,
        borderRadius: size / 3,
      };
      return {containerConfig, circleConfig};
    }

    const containerConfig =
      size === 'large'
        ? largeContainer
        : size === 'small'
        ? smallContainer
        : mediumContainer;

    const circleConfig =
      size === 'large'
        ? largeCircle
        : size === 'small'
        ? smallCircle
        : mediumCircle;

    return {containerConfig, circleConfig};
  }, [size]);

  // Memoize styles with defaults
  const switchStyles = useMemo(() => {
    const {
      backgroundColorOn = theme.role.primary,
      backgroundColorOff = theme.bg.disabled,
      circleColorOn = theme.text.contrast,
      circleColorOff = theme.text.basic,
      container = sizeConfig.containerConfig,
      circle = sizeConfig.circleConfig,
      button,
      onElementContainer,
      offElementContainer,
    } = styles ?? {};

    return {
      backgroundColorOn,
      backgroundColorOff,
      circleColorOn,
      circleColorOff,
      container,
      circle,
      button,
      onElementContainer,
      offElementContainer,
    };
  }, [styles, theme, sizeConfig]);

  // Memoize padding calculations
  const padding = useMemo(() => {
    const paddingLeft =
      (switchStyles.container.padding as number) ||
      (switchStyles.container.paddingLeft as number) ||
      0;
    const paddingRight =
      (switchStyles.container.padding as number) ||
      (switchStyles.container.paddingRight as number) ||
      0;
    return {paddingLeft, paddingRight};
  }, [switchStyles.container]);

  // Memoize position calculations
  const positions = useMemo(() => {
    const circlePosXStart = 0;
    const circlePosXEnd =
      ((switchStyles.container.width ?? mediumContainer.width) as number) -
      ((switchStyles.circle.width ?? mediumCircle.width) as number) -
      (padding.paddingRight + padding.paddingLeft);

    return {circlePosXStart, circlePosXEnd};
  }, [
    switchStyles.container.width,
    switchStyles.circle.width,
    padding,
    mediumContainer,
    smallContainer,
    largeContainer,
  ]);

  const [animXValue] = useState(new Animated.Value(isOn ? 1 : 0));

  // Memoize animation function
  const runAnimation = useCallback(() => {
    const option = {
      fromValue: isOn ? 0 : 1,
      toValue: isOn ? 1 : 0,
      duration,
      useNativeDriver: false,
    };

    Animated.timing(animXValue, option).start();
  }, [animXValue, isOn, duration]);

  useEffect(() => {
    runAnimation();
  }, [runAnimation]);

  // Memoize animated components
  const CircleButton = useMemo(
    () => (
      <Animated.View
        style={[
          switchStyles.circle,
          {
            backgroundColor: animXValue.interpolate({
              inputRange: [0.5, 1],
              outputRange: [
                switchStyles.circleColorOff as string | number,
                switchStyles.circleColorOn as string | number,
              ] as string[] | number[],
            }),
          },
          {
            transform: [
              {
                translateX: animXValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    positions.circlePosXStart as string | number,
                    positions.circlePosXEnd as string | number,
                  ] as string[] | number[],
                }),
              },
            ],
          },
          switchStyles.button,
        ]}
      />
    ),
    [switchStyles, animXValue, positions]
  );

  const OnElement = useMemo(
    () => (
      <Animated.View style={[{opacity: animXValue}, switchStyles.onElementContainer]}>
        {onElement}
      </Animated.View>
    ),
    [animXValue, switchStyles.onElementContainer, onElement]
  );

  const OffElement = useMemo(
    () => (
      <Animated.View
        style={[
          {
            opacity: animXValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
          switchStyles.offElementContainer,
        ]}
      >
        {offElement}
      </Animated.View>
    ),
    [animXValue, switchStyles.offElementContainer, offElement]
  );

  // Memoize container styles
  const containerStyles = useMemo(
    () => [
      switchStyles.container,
      {
        paddingLeft: padding.paddingLeft,
        paddingRight: padding.paddingRight,
      },
      {
        backgroundColor: animXValue.interpolate({
          inputRange: [0, 1],
          outputRange: [
            switchStyles.backgroundColorOff as string | number,
            switchStyles.backgroundColorOn as string | number,
          ] as string[] | number[],
        }),
      },
    ],
    [switchStyles, padding, animXValue]
  );

  return (
    <TouchableOpacity
      accessibilityRole="switch"
      activeOpacity={0.8}
      onPress={onPress}
      style={style}
      testID={testID}
    >
      <AnimatedContainer style={containerStyles}>
        {isOn ? OnElement : OffElement}
        {CircleButton}
      </AnimatedContainer>
    </TouchableOpacity>
  );
}

// Export memoized component for better performance
export default React.memo(SwitchToggle) as typeof SwitchToggle;
