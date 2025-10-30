import type {CpkTheme} from './src/utils/theme';

declare module 'kstyled' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends CpkTheme {}
}
