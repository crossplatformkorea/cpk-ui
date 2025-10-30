import {Animated} from 'react-native';
import {styled, css} from 'kstyled';
import {CpkTheme, isEmptyObject} from '../../../utils/theme';
import {light} from '../../../utils/colors';
import {Typography} from '../Typography/Typography';

export type ButtonType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light';

export type SnackbarType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger';

// Default theme resolver
function resolveTheme(theme: undefined): typeof light;
function resolveTheme<T extends CpkTheme>(theme: T): T;
function resolveTheme<T extends CpkTheme>(theme?: T): T | typeof light {
  return isEmptyObject(theme) ? light : theme!;
}

// ButtonWrapper Component
export const ButtonWrapper = styled.View<{
  $type?: ButtonType;
  $outlined?: boolean;
  $disabled?: boolean;
  $loading?: boolean;
}>`
  border-width: ${({$outlined}) => ($outlined ? '1px' : undefined)};
  background-color: ${({theme, $type, $outlined, $loading, $disabled}) => {
    theme = resolveTheme(theme);

    if ($loading) {
      return $outlined ? undefined : theme.button[$type!].bg;
    }
    if ($disabled) {
      return undefined;
    }
    return $outlined ? theme.bg.basic : theme.button[$type ?? 'primary'].bg;
  }};
  border-color: ${({theme, $type, $disabled}) => {
    theme = resolveTheme(theme);

    if ($disabled) {
      return theme.bg.basic;
    }
    return theme.button[$type!].bg;
  }};
`;

// ButtonText Component
export const ButtonText = styled(Typography.Body2)<{
  $outlined?: boolean;
  $type?: ButtonType | SnackbarType;
  $disabled?: boolean;
  $loading?: boolean;
  theme?: CpkTheme;
}>`
  color: ${({theme, $outlined, $type, $disabled}) => {
    theme = resolveTheme(theme);

    if ($outlined) {
      return theme.text.basic;
    }
    if ($disabled) {
      return theme.text.disabled;
    }
    return theme.button[$type!].text;
  }};
`;

// CheckboxWrapperOutlined Component
export const CheckboxWrapperOutlined = styled.View<{
  $type: ButtonType;
  $disabled?: boolean;
  $checked?: boolean;
}>`
  border-width: 1px;
  border-color: ${({theme, $type, $disabled}) => {
    theme = resolveTheme(theme);

    if ($disabled) {
      return theme.bg.disabled;
    }
    return $type === 'light'
      ? theme.role.primary
      : theme.button[$type ?? 'primary'].bg;
  }};
`;

// CheckboxWrapper Component
export const CheckboxWrapper = styled.View<{
  $type: ButtonType;
  $disabled?: boolean;
  $checked?: boolean;
}>`
  background-color: ${({theme, $checked, $type, $disabled}) => {
    theme = resolveTheme(theme);

    if ($disabled) {
      return undefined;
    }
    if (!$checked) {
      return theme.bg.disabled;
    }
    return $type === 'light'
      ? theme.role.primary
      : theme.button[$type ?? 'primary'].bg;
  }};
`;

// RadioButtonWrapper Component
export const RadioButtonWrapper = styled.View<{
  $type: ButtonType;
  $selected?: boolean;
  $disabled?: boolean;
}>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  margin: 0px 6px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${({theme, $type, $selected, $disabled}) => {
    theme = resolveTheme(theme);

    if ($disabled) {
      return theme.bg.disabled;
    }
    const buttonColor = $type === 'light'
      ? theme.role.primary
      : theme.button[$type ?? 'primary'].bg;
    return $selected ? buttonColor : theme.text.basic;
  }};
  background-color: transparent;
`;

// RadioWrapper Component
export const RadioWrapper = styled(Animated.View)<{
  $type: ButtonType;
  $disabled?: boolean;
  $selected?: boolean;
}>`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme, $type, $disabled, $selected}) => {
    theme = resolveTheme(theme);

    if ($disabled) {
      return theme.bg.disabled;
    }
    if (!$selected) {
      return 'transparent';
    }
    return $type === 'light'
      ? theme.role.primary
      : theme.button[$type ?? 'primary'].bg;
  }};
`;

// ColoredText Component
export const ColoredText = styled(Typography.Body2)<{
  $type: ButtonType;
  $disabled?: boolean;
  $selected?: boolean;
}>`
  color: ${({theme, $selected, $type, $disabled}) => {
    theme = resolveTheme(theme);

    if ($disabled) {
      return undefined;
    }
    if (!$selected) {
      return theme.text.basic;
    }
    return $type === 'light'
      ? theme.role.primary
      : theme.button[$type ?? 'primary'].bg;
  }};
`;

// SnackbarWrapper Component
export const SnackbarWrapper = styled.View<{
  $type?: SnackbarType;
  $checked?: boolean;
}>`
  background-color: ${({theme, $type}) => {
    theme = resolveTheme(theme);

    return !$type ? theme.bg.disabled : theme.button[$type ?? 'light'].bg;
  }};
  flex-direction: row;
  text-align: left;
  align-items: center;
  align-self: center;
  position: absolute;
  font-size: 16px;
  padding: 10px 20px;
  bottom: 20px;
  border-radius: 20px;
`;
