import type {CpkTheme} from './src/utils/theme';
import type {CSSObject} from '@emotion/react';
import type {ImageStyle, StyleProp, TextStyle, ViewStyle} from 'react-native';

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends CpkTheme {}
}

declare module '@emotion/native' {
  // Overload for ViewStyle
  export function css(
    ...args: Array<CSSObject | StyleProp<ViewStyle>>
  ): ReturnType<typeof css>;

  // Overload for TextStyle
  export function css(
    ...args: Array<CSSObject | StyleProp<TextStyle>>
  ): ReturnType<typeof css>;

  // Overload for ImageStyle
  export function css(
    ...args: Array<CSSObject | StyleProp<ImageStyle>>
  ): ReturnType<typeof css>;
}
