import {Animated} from 'react-native';
import {styled, css} from 'kstyled';
import {getTheme} from '../../../utils/theme';
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

// ButtonWrapper Component
export const ButtonWrapper = styled.View<{
  $type?: ButtonType;
  $outlined?: boolean;
  $disabled?: boolean;
  $loading?: boolean;
}>`
  border-width: ${({$outlined}) => ($outlined ? '1px' : undefined)};
  background-color: ${({theme, $type, $outlined, $loading, $disabled}) => {
    const resolvedTheme = getTheme(theme);

    if ($loading) {
      return $outlined ? undefined : resolvedTheme.button[$type ?? 'primary'].bg;
    }
    if ($disabled) {
      return undefined;
    }
    return $outlined ? resolvedTheme.bg.basic : resolvedTheme.button[$type ?? 'primary'].bg;
  }};
  border-color: ${({theme, $type, $disabled}) => {
    const resolvedTheme = getTheme(theme);

    if ($disabled) {
      return resolvedTheme.bg.basic;
    }
    return resolvedTheme.button[$type ?? 'primary'].bg;
  }};
`;

// ButtonText Component
export const ButtonText = styled(Typography.Body2)<{
  $outlined?: boolean;
  $type?: ButtonType | SnackbarType;
  $disabled?: boolean;
  $loading?: boolean;
}>`
  color: ${({theme, $outlined, $type, $disabled}) => {
    const resolvedTheme = getTheme(theme);

    if ($outlined) {
      return resolvedTheme.text.basic;
    }
    if ($disabled) {
      return resolvedTheme.text.disabled;
    }
    return resolvedTheme.button[$type ?? 'primary'].text;
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
    const resolvedTheme = getTheme(theme);

    if ($disabled) {
      return resolvedTheme.bg.disabled;
    }
    return $type === 'light'
      ? resolvedTheme.role.primary
      : resolvedTheme.button[$type ?? 'primary'].bg;
  }};
`;

// CheckboxWrapper Component
export const CheckboxWrapper = styled.View<{
  $type: ButtonType;
  $disabled?: boolean;
  $checked?: boolean;
}>`
  background-color: ${({theme, $checked, $type, $disabled}) => {
    const resolvedTheme = getTheme(theme);

    if ($disabled) {
      return undefined;
    }
    if (!$checked) {
      return resolvedTheme.bg.disabled;
    }
    return $type === 'light'
      ? resolvedTheme.role.primary
      : resolvedTheme.button[$type ?? 'primary'].bg;
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
    const resolvedTheme = getTheme(theme);

    if ($disabled) {
      return resolvedTheme.bg.disabled;
    }
    const buttonColor = $type === 'light'
      ? resolvedTheme.role.primary
      : resolvedTheme.button[$type ?? 'primary'].bg;
    return $selected ? buttonColor : resolvedTheme.text.basic;
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
    const resolvedTheme = getTheme(theme);

    if ($disabled) {
      return resolvedTheme.bg.disabled;
    }
    if (!$selected) {
      return 'transparent';
    }
    return $type === 'light'
      ? resolvedTheme.role.primary
      : resolvedTheme.button[$type ?? 'primary'].bg;
  }};
`;

// ColoredText Component
export const ColoredText = styled(Typography.Body2)<{
  $type: ButtonType;
  $disabled?: boolean;
  $selected?: boolean;
}>`
  color: ${({theme, $selected, $type, $disabled}) => {
    const resolvedTheme = getTheme(theme);

    if ($disabled) {
      return undefined;
    }
    if (!$selected) {
      return resolvedTheme.text.basic;
    }
    return $type === 'light'
      ? resolvedTheme.role.primary
      : resolvedTheme.button[$type ?? 'primary'].bg;
  }};
`;

// SnackbarWrapper Component
export const SnackbarWrapper = styled.View<{
  $type?: SnackbarType;
  $checked?: boolean;
}>`
  background-color: ${({theme, $type}) => {
    const resolvedTheme = getTheme(theme);

    return !$type ? resolvedTheme.bg.disabled : resolvedTheme.button[$type ?? 'light'].bg;
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
