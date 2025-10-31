import 'kstyled';
import {CpkThemeBase} from '../utils/theme';

declare module 'kstyled' {
  export interface DefaultTheme extends CpkThemeBase {}
}
