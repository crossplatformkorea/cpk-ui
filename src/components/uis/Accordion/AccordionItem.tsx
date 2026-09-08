import React, {useMemo, useState, type ReactElement} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated, {
  Easing,
  LinearTransition,
  ReduceMotion,
  useReducedMotion,
} from 'react-native-reanimated';
import {useTheme} from '../../../providers/ThemeProvider';
import {Icon} from '../Icon/Icon';
import {Typography} from '../Typography/Typography';
import type {AccordionBaseProps} from './Accordion';

export type AccordionItemDataType<T, K> = {title: T; items: K[]};

type Props<T, K> = Omit<
  AccordionBaseProps<T, K>,
  'data' | 'style' | 'onExpandedChange'
> & {
  testID: string;
  data: AccordionItemDataType<T, K>;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
};

/** One mounted body: no invisible duplicate controls or JS-frame height loop. */
export function AccordionItem<T, K>({
  testID,
  data,
  size = 'medium',
  shouldAnimate = true,
  collapseOnStart = true,
  expanded: controlledExpanded,
  onExpandedChange,
  animDuration = 200,
  activeOpacity = 1,
  toggleElement,
  toggleElementPosition = 'right',
  onPressItem,
  renderTitle,
  renderHeader,
  renderItem,
  styles,
}: Props<T, K>): ReactElement {
  const {theme} = useTheme();
  const reducedMotion = useReducedMotion();
  const [localExpanded, setLocalExpanded] = useState(!collapseOnStart);
  const expanded = controlledExpanded ?? localExpanded;
  const duration = shouldAnimate && !reducedMotion ? animDuration : 0;
  const transition = useMemo(
    () =>
      LinearTransition.duration(duration)
        .easing(Easing.bezier(0.23, 1, 0.32, 1))
        .reduceMotion(ReduceMotion.System),
    [duration],
  );
  const toggle = (): void => {
    if (controlledExpanded === undefined) setLocalExpanded(!expanded);
    onExpandedChange?.(!expanded);
  };
  const numeric = typeof size === 'number';
  const titleHeight = numeric
    ? size * 2.4
    : size === 'small'
      ? 40
      : size === 'large'
        ? 56
        : 48;
  const vertical = numeric
    ? size * 0.4
    : size === 'small'
      ? 6
      : size === 'large'
        ? 10
        : 8;
  const horizontal = numeric
    ? size * 0.6
    : size === 'small'
      ? 10
      : size === 'large'
        ? 14
        : 12;
  const titleFontSize = numeric
    ? size
    : size === 'small'
      ? 14
      : size === 'large'
        ? 18
        : 16;
  const itemFontSize = numeric
    ? size * 0.875
    : size === 'small'
      ? 12
      : size === 'large'
        ? 16
        : 14;
  const iconSize = numeric
    ? size * 0.7
    : size === 'small'
      ? 12
      : size === 'large'
        ? 16
        : 14;
  const toggleView = (
    <Animated.View
      style={[
        {
          marginRight: toggleElementPosition === 'left' ? horizontal : 0,
          transform: [{rotate: expanded ? '180deg' : '0deg'}],
          transitionProperty: 'transform',
          transitionDuration: duration,
          transitionTimingFunction: 'ease-out',
        },
        styles?.toggleElement,
      ]}
    >
      {toggleElement === undefined ? (
        <Icon name="CaretDown" color={theme.text.basic} size={iconSize} />
      ) : (
        toggleElement
      )}
    </Animated.View>
  );
  return (
    <Animated.View
      collapsable={false}
      layout={transition}
      style={[layout.container, styles?.container]}
    >
      {renderHeader ? (
        renderHeader({title: data.title, expanded, toggle})
      ) : (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          aria-expanded={expanded}
          accessibilityRole="button"
          accessibilityLabel={
            typeof data.title === 'string' ? data.title : 'Accordion section'
          }
          accessibilityState={{expanded}}
          accessibilityHint={
            expanded ? 'Double tap to collapse' : 'Double tap to expand'
          }
          onPress={toggle}
          style={[
            layout.title,
            {
              minHeight: titleHeight,
              paddingVertical: vertical,
              paddingHorizontal: horizontal,
              backgroundColor: theme.bg.basic,
              justifyContent:
                toggleElementPosition === 'right'
                  ? 'space-between'
                  : 'flex-start',
            },
            styles?.titleContainer,
          ]}
          testID={`title-${testID}`}
        >
          {toggleElementPosition === 'left' ? toggleView : null}
          {renderTitle ? (
            renderTitle(data.title)
          ) : typeof data.title === 'string' ? (
            <Typography.Heading4
              style={[
                {fontSize: titleFontSize, flexShrink: 1},
                styles?.titleText,
              ]}
            >
              {data.title}
            </Typography.Heading4>
          ) : null}
          {toggleElementPosition === 'right' ? toggleView : null}
        </TouchableOpacity>
      )}
      <Animated.View
        collapsable={false}
        layout={transition}
        accessibilityElementsHidden={!expanded}
        accessibilityState={{expanded}}
        aria-hidden={!expanded}
        importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
        pointerEvents={expanded ? 'auto' : 'none'}
        style={[
          layout.body,
          {
            height: expanded ? undefined : 0,
            opacity: expanded ? 1 : 0,
            transitionProperty: 'opacity',
            transitionDuration: duration,
            transitionTimingFunction: 'ease-out',
          },
        ]}
        testID={`body-${testID}`}
      >
        {data.items.map((body, index) => {
          const content = renderItem ? (
            renderItem(body)
          ) : typeof body === 'string' ? (
            <Typography.Body3
              style={[{fontSize: itemFontSize}, styles?.itemText]}
            >
              {body}
            </Typography.Body3>
          ) : null;
          const itemStyle = [
            {
              backgroundColor: theme.bg.paper,
              paddingVertical: vertical,
              paddingHorizontal: horizontal,
            },
            styles?.itemContainer,
          ];
          // Do not wrap custom controls in a second pressable.
          return onPressItem ? (
            <TouchableOpacity
              key={index}
              activeOpacity={activeOpacity}
              disabled={!expanded}
              onPress={() => onPressItem(data.title, body)}
              style={itemStyle}
            >
              {content}
            </TouchableOpacity>
          ) : (
            <View key={index} style={itemStyle}>
              {content}
            </View>
          );
        })}
      </Animated.View>
    </Animated.View>
  );
}

const layout = StyleSheet.create({
  container: {overflow: 'hidden', flexDirection: 'column'},
  title: {flexDirection: 'row', alignItems: 'center'},
  body: {overflow: 'hidden'},
});

export default React.memo(AccordionItem) as typeof AccordionItem;
