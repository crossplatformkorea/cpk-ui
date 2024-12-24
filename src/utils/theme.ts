import {Colors, light} from './colors';

export type CpkTheme = Colors & {
  isPortrait?: boolean;
  isDesktop?: boolean;
  isTablet?: boolean;
  isMobile?: boolean;
};

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type CpkThemeParams = RecursivePartial<CpkTheme>;

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

export const getTheme = (theme?: CpkTheme): CpkTheme => {
  return isEmptyObject(theme) || theme === undefined ? light : theme;
};
