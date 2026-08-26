import type {CpkTheme} from '../../../utils/theme';
import type {CalendarColors, CalendarPalette} from './types';
import {readableTextOn, relativeLuminance} from './utils';

/**
 * The calendar reads exactly the tokens listed below and nothing else.
 * `background` is the only literal in the component: the grid inherits the surface
 * it sits on instead of painting its own, so dark mode needs no special casing.
 */
const TRANSPARENT = 'transparent';

/**
 * Auto contrast for a caller supplied `selectedBackground`.
 * A ledger colour such as a saturated yellow is unreadable under a hard coded white
 * label, so the label is picked by relative luminance from the two text tokens.
 */
function resolveSelectedText(
  theme: CpkTheme,
  selectedBackground: string,
): string {
  const contrastLuminance = relativeLuminance(theme.text.contrast);
  const basicLuminance = relativeLuminance(theme.text.basic);

  if (contrastLuminance === null || basicLuminance === null) {
    return theme.text.contrast;
  }

  const lighter =
    contrastLuminance >= basicLuminance
      ? theme.text.contrast
      : theme.text.basic;
  const darker =
    contrastLuminance >= basicLuminance
      ? theme.text.basic
      : theme.text.contrast;

  return readableTextOn(selectedBackground, lighter, darker);
}

export function resolveCalendarPalette(
  theme: CpkTheme,
  colors?: CalendarColors,
): CalendarPalette {
  const selectedBackground = colors?.selectedBackground ?? theme.role.primary;
  const selectedText =
    colors?.selectedText ??
    (colors?.selectedBackground
      ? resolveSelectedText(theme, colors.selectedBackground)
      : theme.text.contrast);

  return Object.freeze({
    background: colors?.background ?? TRANSPARENT,
    headerText: colors?.headerText ?? theme.text.basic,
    navIcon: colors?.navIcon ?? theme.text.basic,
    weekdayLabel: colors?.weekdayLabel ?? theme.text.label,
    weekNumberLabel: colors?.weekNumberLabel ?? theme.text.disabled,
    dayText: colors?.dayText ?? theme.text.basic,
    sundayText: colors?.sundayText ?? theme.role.danger,
    saturdayText: colors?.saturdayText ?? theme.role.info,
    outsideText: colors?.outsideText ?? theme.text.disabled,
    disabledText: colors?.disabledText ?? theme.text.disabled,
    todayText: colors?.todayText ?? theme.role.secondary,
    todayRing: colors?.todayRing ?? theme.role.secondary,
    selectedBackground,
    selectedText,
    underlay: colors?.underlay ?? theme.role.underlay,
    border: colors?.border ?? theme.role.border,
    dot: colors?.dot ?? theme.role.primary,
    badgeText: colors?.badgeText ?? theme.text.label,
  });
}

const PALETTE_KEYS = Object.keys(
  resolveCalendarPalette({
    bg: {basic: '', paper: '', disabled: ''},
    role: {
      primary: '',
      secondary: '',
      success: '',
      warning: '',
      danger: '',
      info: '',
      accent: '',
      link: '',
      border: '',
      underlay: '',
      underlayContrast: '',
    },
    text: {
      basic: '',
      label: '',
      placeholder: '',
      disabled: '',
      validation: '',
      contrast: '',
    },
  } as CpkTheme),
) as (keyof CalendarPalette)[];

/**
 * `ThemeProvider` rebuilds its context value on every render, so comparing the
 * resolved colours by value is what keeps `chrome` (and therefore all 42 cells)
 * from re-rendering when nothing about the theme actually changed.
 */
export function isSamePalette(a: CalendarPalette, b: CalendarPalette): boolean {
  if (a === b) {
    return true;
  }

  for (const key of PALETTE_KEYS) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
