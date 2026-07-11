import React, {
  useLayoutEffect,
  useMemo,
  useRef,
  useCallback,
  type ReactElement,
} from 'react';
import type {LayoutChangeEvent, StyleProp, ViewStyle} from 'react-native';
import {Animated, Easing, Platform, View} from 'react-native';
import type {IconName} from '../Icon/Icon';
import type {ButtonSizeType} from '../Button/Button';
import {IconButton} from '../IconButton/IconButton';

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
}: FabProps): ReactElement {
  const {Fab, FabItem} = styles ?? {};

  const spinValue = useRef(new Animated.Value(0));
  const positionValue = useRef(new Animated.Value(0));
  const fabHeight = useRef(0);

  // Memoize animation configuration
  const animationConfig = useMemo(
    () => ({
      duration: animationDuration,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
    [animationDuration],
  );

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
  const handleItemPress = useCallback(
    (icon: IconName) => {
      onPressItem?.(icon);
    },
    [onPressItem],
  );

  // Memoize main FAB press handler
  const handleFabPress = useCallback(() => {
    onPressFab();
  }, [onPressFab]);

  // Memoize container styles
  const containerStyles = useMemo(
    () => [
      {
        position: 'absolute' as const,
        right: 10,
        bottom: 10,
        zIndex: 999,
      },
      style,
    ],
    [style],
  );

  // Memoize spin interpolation
  const spinInterpolation = useMemo(
    () =>
      spinValue.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
      }),
    [],
  );

  // Memoize main FAB styles
  const mainFabStyles = useMemo(
    () => [
      {
        transform: [{rotate: spinInterpolation}],
      },
      Fab,
    ],
    [spinInterpolation, Fab],
  );

  // Memoize icon items rendering
  const iconItems = useMemo(
    () =>
      icons.map((icon, idx) => (
        <Animated.View
          accessibilityElementsHidden={!isActive}
          aria-hidden={!isActive}
          importantForAccessibility={isActive ? 'auto' : 'no-hide-descendants'}
          key={`${icon}-${idx}`}
          style={[
            {
              pointerEvents: isActive ? 'auto' : 'none',
              position: 'absolute' as const,
              transform: [{translateY: offsets[idx]}],
            },
            FabItem,
          ]}
          testID={`fab-item-${icon}`}
        >
          <IconButton
            {...iconButtonProps}
            disabled={!isActive || iconButtonProps?.disabled}
            icon={icon}
            onPress={() => handleItemPress(icon)}
            size={buttonSize}
            testID={icon}
          />
        </Animated.View>
      )),
    [
      icons,
      offsets,
      FabItem,
      handleItemPress,
      buttonSize,
      iconButtonProps,
      isActive,
    ],
  );

  const mainTouchableProps = useMemo(
    () => ({
      ...iconButtonProps?.touchableHighlightProps,
      accessibilityState: {
        ...iconButtonProps?.touchableHighlightProps?.accessibilityState,
        expanded: isActive,
      },
      'aria-expanded': isActive,
    }),
    [iconButtonProps?.touchableHighlightProps, isActive],
  );

  return (
    <View style={containerStyles}>
      {iconItems}
      <Animated.View onLayout={onLayout} style={mainFabStyles}>
        <IconButton
          {...iconButtonProps}
          accessibilityLabel={
            iconButtonProps?.accessibilityLabel ??
            (isActive ? 'Close actions' : 'Open actions')
          }
          icon={fabIcon}
          onPress={handleFabPress}
          size={buttonSize}
          testID={iconButtonProps?.testID ?? 'fab-toggle'}
          touchableHighlightProps={mainTouchableProps}
        />
      </Animated.View>
    </View>
  );
}

export {FloatingActionButtons as Fab};
