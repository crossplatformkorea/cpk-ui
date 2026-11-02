import React, {useMemo, type ReactElement} from 'react';
import type {PressableProps, StyleProp, ViewStyle} from 'react-native';
import {Platform, Pressable} from 'react-native';
import {useTheme} from '../../../providers/ThemeProvider';

const DEFAULT_HIT_SLOP = {top: 4, bottom: 4, left: 6, right: 6};

function CustomPressable(
  props: PressableProps & {style?: StyleProp<ViewStyle>},
): ReactElement {
  const {
    accessibilityRole = 'button',
    children,
    style,
    hitSlop,
    android_ripple,
    ...restProps
  } = props;
  const {theme} = useTheme();

  const effectiveHitSlop = useMemo(
    () => hitSlop ?? DEFAULT_HIT_SLOP,
    [hitSlop],
  );

  const styleFunction = useMemo(
    () =>
      ({pressed}: {pressed: boolean}): StyleProp<ViewStyle> => {
        // Android paints one foreground ripple, including over filled children.
        // Its native outline follows the caller's shape instead of the hit slop.
        if (Platform.OS === 'android') return [style, {overflow: 'hidden'}];
        if (pressed) return [style, {opacity: 0.72}];
        return style;
      },
    [theme.role.underlay, style],
  );

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      hitSlop={effectiveHitSlop}
      android_ripple={
        Platform.OS === 'android'
          ? {
              color: theme.role.underlay,
              foreground: true,
              borderless: false,
              ...android_ripple,
            }
          : android_ripple
      }
      style={styleFunction}
      {...restProps}
    >
      {children}
    </Pressable>
  );
}

// Export memoized component for better performance
export default React.memo(CustomPressable) as typeof CustomPressable;
export {CustomPressable};
