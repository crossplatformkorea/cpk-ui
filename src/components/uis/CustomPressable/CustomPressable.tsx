import React, {useMemo} from 'react';
import type {PressableProps, StyleProp, ViewStyle} from 'react-native';
import {Pressable} from 'react-native';
import {css} from 'kstyled';
import {useCPK} from '../../../providers';

const DEFAULT_HIT_SLOP = {top: 4, bottom: 4, left: 6, right: 6};

function CustomPressable(
  props: PressableProps & {style?: StyleProp<ViewStyle>},
): React.JSX.Element {
  const {children, style, hitSlop, ...restProps} = props;
  const {theme} = useCPK();

  const effectiveHitSlop = useMemo(() => 
    hitSlop || DEFAULT_HIT_SLOP, 
    [hitSlop]
  );

  const styleFunction = useMemo(
    () => ({pressed}: {pressed: boolean}) => {
      if (pressed) {
        return [
          css`
            background-color: ${theme.role.underlay};
          `,
          style,
        ];
      }
      return style;
    },
    [theme.role.underlay, style]
  );

  return (
    <Pressable
      hitSlop={effectiveHitSlop}
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
