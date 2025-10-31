import {Colors, light} from './colors';

// Internal base theme type for cpk-ui components
export type CpkThemeBase = Colors & {
  isPortrait?: boolean;
  isDesktop?: boolean;
  isTablet?: boolean;
  isMobile?: boolean;
};

// Empty interface for module augmentation (like @emotion/react's Theme)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CpkTheme extends CpkThemeBase {}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type CpkThemeParams = RecursivePartial<CpkThemeBase>;

export type ThemeObjParams = {
  bg: Partial<Colors['bg']>;
  role: Partial<Colors['role']>;
  text: Partial<Colors['text']>;
  button: Partial<Colors['button']>;
};

export interface ThemeParam {
  light?: Partial<ThemeObjParams & any>;
  dark?: Partial<ThemeObjParams & any>;
}

export const isEmptyObject = (param: any): boolean =>
  Object.keys(param).length === 0 && param.constructor === Object;

export const getTheme = (theme?: CpkTheme): CpkThemeBase => {
  return (isEmptyObject(theme) || theme === undefined ? light : theme) as CpkThemeBase;
};
