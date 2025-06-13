import React, {useLayoutEffect, useMemo, useRef, useCallback} from 'react';
import type {LayoutChangeEvent, StyleProp, ViewStyle} from 'react-native';
import {Animated, Easing, Platform, View} from 'react-native';
import {IconName} from '../Icon/Icon';
import {ButtonSizeType} from '../Button/Button';
import {IconButton} from '../IconButton/IconButton';
import {useOptimizedStyles} from '../../../hooks/useOptimizedStyles';
import {safePlatformSelect} from '../../../utils/platform';
import {getButtonAccessibilityProps} from '../../../utils/accessibility';

type Styles = {
  Fab?: StyleProp<ViewStyle>;
  FabItem?: StyleProp<ViewStyle>;
};

export type FabProps = {
  isActive?: boolean;
  icons?: IconName[];
  animationDuration?: number;
  onPressFab: () => void;
  onPressItem?: (item?: IconName) => void;
  buttonSize?: ButtonSizeType | number;
  fabIcon?: IconName;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  styles?: Styles;
  iconButtonProps?: Omit<
    React.ComponentProps<typeof IconButton>,
    'icon' | 'onPress' | 'size'
  >;
};

function FloatingActionButtons({
  isActive = false,
  style,
  styles,
  fabIcon = 'Plus',
  icons = [],
  onPressFab,
  onPressItem,
  buttonSize = 'medium',
  gap = Platform.select({
    web: 60,
    default: 12,
  }) || 12,
  animationDuration = 200,
  iconButtonProps,
}: FabProps): React.JSX.Element {
  const {Fab, FabItem} = styles ?? {};

  const spinValue = useRef(new Animated.Value(0));
  const positionValue = useRef(new Animated.Value(0));
  const fabHeight = useRef(0);

  // Memoize animation configuration
  const animationConfig = useMemo(() => ({
    duration: animationDuration,
    easing: Easing.linear,
    useNativeDriver: true,
  }), [animationDuration]);

  useLayoutEffect(() => {
    const config = {
      toValue: isActive ? 1 : 0,
      ...animationConfig,
    };

    Animated.parallel([
      Animated.timing(spinValue.current, config),
      Animated.timing(positionValue.current, config),
    ]).start();
  }, [isActive, animationConfig]);

  // Memoize offsets calculation
  const offsets = useMemo(
    () =>
      icons?.map((_, idx) =>
        positionValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -1 * (idx + 1) * (fabHeight.current + gap)],
        }),
      ),
    [icons, gap],
  );

  // Memoize layout handler
  const onLayout = useCallback((e: LayoutChangeEvent): void => {
    fabHeight.current = e.nativeEvent.layout.height;
  }, []);

  // Memoize item press handler
  const handleItemPress = useCallback((icon: IconName) => {
    onPressItem?.(icon);
  }, [onPressItem]);

  // Memoize main FAB press handler
  const handleFabPress = useCallback(() => {
    onPressFab();
  }, [onPressFab]);

  // Memoize container styles
  const containerStyles = useMemo(() => [
    {
      position: 'absolute' as const,
      right: 10,
      bottom: 10,
      zIndex: 999,
    },
    style,
  ], [style]);

  // Memoize spin interpolation
  const spinInterpolation = useMemo(() => 
    spinValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    }),
  []);

  // Memoize main FAB styles
  const mainFabStyles = useMemo(() => [
    {
      transform: [{ rotate: spinInterpolation }],
    },
    Fab,
  ], [spinInterpolation, Fab]);

  // Memoize icon items rendering
  const iconItems = useMemo(() => 
    icons.map((icon, idx) => (
      <Animated.View
        key={`${icon}-${idx}`}
        style={[
          {
            position: 'absolute' as const,
            transform: [{translateY: offsets[idx]}],
          },
          FabItem,
        ]}
      >
        <IconButton
          icon={icon}
          onPress={() => handleItemPress(icon)}
          size={buttonSize}
          testID={icon}
          {...iconButtonProps}
        />
      </Animated.View>
    )),
    [icons, offsets, FabItem, handleItemPress, buttonSize, iconButtonProps],
  );

  return (
    <View style={containerStyles}>
      {iconItems}
      <Animated.View onLayout={onLayout} style={mainFabStyles}>
        <IconButton
          icon={fabIcon}
          onPress={handleFabPress}
          size={buttonSize}
          {...iconButtonProps}
        />
      </Animated.View>
    </View>
  );
}

export {FloatingActionButtons as Fab};
