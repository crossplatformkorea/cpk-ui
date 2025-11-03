// Caveat: Expo web needs React to be imported
import React, {useCallback, useEffect, useMemo, useRef, useState, type ReactElement} from 'react';
import type {LayoutChangeEvent} from 'react-native';
import {Animated, Easing, TouchableOpacity, View} from 'react-native';
import {styled, css} from 'kstyled';

import {Icon} from '../Icon/Icon';
import {Typography} from '../Typography/Typography';

import type {AccordionBaseProps} from './Accordion';

import type {AccordionSizeType} from './Accordion';

const TitleTouch = styled(TouchableOpacity)<{$size?: AccordionSizeType}>`
  height: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 2.4;
    return $size === 'small' ? 40 : $size === 'large' ? 56 : 48;
  }};
  background-color: ${({theme}) => theme.bg.basic};

  flex-direction: row;
  align-items: center;
  padding-top: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 0.4;
    return $size === 'small' ? 6 : $size === 'large' ? 10 : 8;
  }};
  padding-bottom: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 0.4;
    return $size === 'small' ? 6 : $size === 'large' ? 10 : 8;
  }};
  padding-left: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 0.6;
    return $size === 'small' ? 10 : $size === 'large' ? 14 : 12;
  }};
  padding-right: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 0.6;
    return $size === 'small' ? 10 : $size === 'large' ? 14 : 12;
  }};
`;

const StyledIcon = styled(Icon)<{$size?: AccordionSizeType}>`
  color: ${({theme}) => theme.text.basic};
  font-weight: bold;
  font-size: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 0.7;
    return $size === 'small' ? 12 : $size === 'large' ? 16 : 14;
  }};
`;

const ItemTouch = styled(TouchableOpacity)<{$size?: AccordionSizeType}>`
  background-color: ${({theme}) => theme.bg.paper};
  padding-top: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 0.4;
    return $size === 'small' ? 6 : $size === 'large' ? 10 : 8;
  }};
  padding-bottom: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 0.4;
    return $size === 'small' ? 6 : $size === 'large' ? 10 : 8;
  }};
  padding-left: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 0.6;
    return $size === 'small' ? 10 : $size === 'large' ? 14 : 12;
  }};
  padding-right: ${({$size = 'medium'}) => {
    if (typeof $size === 'number') return $size * 0.6;
    return $size === 'small' ? 10 : $size === 'large' ? 14 : 12;
  }};

  flex-direction: row;
  align-items: center;
`;

export type AccordionItemDataType<T, K> = {
  title: T;
  items: K[];
};

type Props<T, K> = Omit<AccordionBaseProps<T, K>, 'data' | 'style'> & {
  testID: string;
  data: AccordionItemDataType<string, string> | AccordionItemDataType<T, K>;
};

export function AccordionItem<T, K>({
  testID,
  data: data,
  size = 'medium',
  shouldAnimate = true,
  collapseOnStart = true,
  animDuration = 200,
  activeOpacity = 1,
  toggleElement,
  toggleElementPosition,
  onPressItem,
  renderTitle,
  renderItem,
  styles,
}: Props<T, K>): ReactElement {
  // Calculate icon size based on accordion size
  const iconSize = typeof size === 'number'
    ? size * 0.7
    : size === 'small' ? 12 : size === 'large' ? 16 : 14;

  const defaultToggleElement = <StyledIcon name="CaretDown" $size={size} size={iconSize} />;
  const dropDownAnimValueRef = useRef(new Animated.Value(0));
  const rotateAnimValueRef = useRef(new Animated.Value(0));
  const fadeItemAnim = useRef(new Animated.Value(0)).current;
  const [itemHeight, setItemHeight] = useState(0);
  const [collapsed, setCollapsed] = useState(collapseOnStart);

  // Memoize animation configuration
  const animationConfig = useMemo(() => ({
    duration: animDuration,
    easing: Easing.linear,
    useNativeDriver: false,
  }), [animDuration]);

  useEffect(() => {
    Animated.timing(fadeItemAnim, {
      toValue: collapsed ? 0 : 1,
      duration: !collapsed ? 300 : 100,
      useNativeDriver: false,
    }).start();
  }, [fadeItemAnim, collapsed]);

  useEffect(() => {
    const targetValue = collapsed ? 0 : 1;

    if (!shouldAnimate) {
      rotateAnimValueRef.current.setValue(targetValue);
      dropDownAnimValueRef.current.setValue(targetValue);
      return;
    }

    const config = {
      ...animationConfig,
      toValue: targetValue,
    };

    Animated.parallel([
      Animated.timing(rotateAnimValueRef.current, config),
      Animated.timing(dropDownAnimValueRef.current, config),
    ]).start();
  }, [collapsed, shouldAnimate, animationConfig]);

  // Memoize callbacks
  const handleToggle = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  const handleItemPress = useCallback((body: K | string) => {
    onPressItem?.(data.title, body);
  }, [onPressItem, data.title]);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setItemHeight(e.nativeEvent.layout.height);
  }, []);

  // Calculate margin based on size
  const toggleMargin = typeof size === 'number'
    ? size * 0.6
    : size === 'small' ? 10 : size === 'large' ? 14 : 12;

  // Memoize toggle element container
  const toggleElContainer = useMemo(() => (
    <Animated.View
      style={[
        css`
          margin-right: ${toggleElementPosition === 'left' ? toggleMargin : 0}px;
        `,
        {
          transform: [
            {
              rotate: rotateAnimValueRef.current.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              }),
            },
          ],
        },
        styles?.toggleElement,
      ]}
    >
      {toggleElement || defaultToggleElement}
    </Animated.View>
  ), [toggleElement, defaultToggleElement, toggleElementPosition, toggleMargin, styles?.toggleElement]);

  // Memoize container styles
  const containerStyles = useMemo(() => [
    css`
      background-color: transparent;
      overflow: hidden;
      flex-direction: column-reverse;
    `,
    styles?.container,
  ], [styles?.container]);

  const titleContainerStyles = useMemo(() => [
    css`
      justify-content: ${toggleElementPosition === 'right'
        ? 'space-between'
        : 'flex-start'};
    `,
    styles?.titleContainer,
  ], [toggleElementPosition, styles?.titleContainer]);

  // Memoize animated styles
  const animatedItemStyles = useMemo(() => [
    {
      opacity: fadeItemAnim,
      height: dropDownAnimValueRef.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0, itemHeight],
      }),
    },
  ], [fadeItemAnim, itemHeight]);

  // Calculate font sizes based on size prop
  const titleFontSize = typeof size === 'number'
    ? size
    : size === 'small' ? 14 : size === 'large' ? 18 : 16;

  const itemFontSize = typeof size === 'number'
    ? size * 0.875
    : size === 'small' ? 12 : size === 'large' ? 16 : 14;

  return (
    <Animated.View style={containerStyles}>
      {/* Invisible: Place it at the top for z-index */}
      <View
        onLayout={handleLayout}
        style={css`
          position: absolute;
          opacity: 0;
        `}
      >
        {data.items.map((body, index) => (
          <ItemTouch
            activeOpacity={activeOpacity}
            key={`body-${index}`}
            onPress={() => handleItemPress(body)}
            $size={size}
          >
            {typeof body === 'string' && !renderItem ? (
              <Typography.Body3 style={[{fontSize: itemFontSize}, styles?.itemText]}>
                {body}
              </Typography.Body3>
            ) : (
              renderItem?.(body as K)
            )}
          </ItemTouch>
        ))}
      </View>

      {/* Item */}
      <Animated.View
        accessibilityState={{expanded: !collapsed}}
        style={animatedItemStyles}
        testID={`body-${testID}`}
      >
        {data.items.map((body, index) => (
          <ItemTouch
            activeOpacity={activeOpacity}
            key={`body-${index}`}
            onPress={() => handleItemPress(body)}
            style={styles?.itemContainer}
            $size={size}
          >
            {typeof body === 'string' && !renderItem ? (
              <Typography.Body3 style={[{fontSize: itemFontSize}, styles?.itemText]}>
                {body}
              </Typography.Body3>
            ) : (
              renderItem?.(body as K)
            )}
          </ItemTouch>
        ))}
      </Animated.View>

      {/* Title */}
      <TitleTouch
        activeOpacity={activeOpacity}
        onPress={handleToggle}
        accessibilityRole="button"
        accessibilityLabel={typeof data.title === 'string' ? data.title : 'Accordion section'}
        accessibilityState={{expanded: !collapsed}}
        accessibilityHint={collapsed ? 'Double tap to expand' : 'Double tap to collapse'}
        style={titleContainerStyles}
        testID={`title-${testID}`}
        $size={size}
      >
        {toggleElementPosition === 'left' ? toggleElContainer : null}
        {typeof data.title === 'string' && !renderTitle ? (
          <Typography.Heading4 style={[{fontSize: titleFontSize}, styles?.titleText]}>
            {data.title}
          </Typography.Heading4>
        ) : (
          renderTitle?.(data.title as T)
        )}
        {toggleElementPosition === 'right' ? toggleElContainer : null}
      </TitleTouch>
    </Animated.View>
  );
}

// Export memoized component for better performance
export default React.memo(AccordionItem) as typeof AccordionItem;
