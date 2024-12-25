import type {PressableProps, StyleProp, ViewStyle} from 'react-native';
import {Pressable} from 'react-native';
import {css} from '@emotion/native';
import {useCPK} from '../../../providers';

export function CustomPressable(
  props: PressableProps & {style?: StyleProp<ViewStyle>},
): JSX.Element {
  const {children, style, hitSlop} = props;
  const {theme} = useCPK();

  return (
    <Pressable
      hitSlop={hitSlop || {top: 4, bottom: 4, left: 6, right: 6}}
      {...props}
      style={({pressed}) => {
        if (pressed) {
          return [
            css`
              background-color: ${theme.role.underlay};
            `,
            style,
          ];
        }

        return style;
      }}
    >
      {children}
    </Pressable>
  );
}
