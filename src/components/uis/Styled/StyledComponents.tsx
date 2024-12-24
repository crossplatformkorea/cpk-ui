import {Animated} from 'react-native';
import styled from '@emotion/native';
import {CpkTheme, isEmptyObject} from '../../../utils/theme';
import {light} from '../../../utils/colors';

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

// 기본 theme 설정 함수
const resolveTheme = (theme?: CpkTheme) =>
  isEmptyObject(theme) ? light : theme!;

// ButtonWrapper Component
export const ButtonWrapper = styled.View<{
  type?: ButtonType;
  outlined?: boolean;
  disabled?: boolean;
  loading?: boolean;
}>`
  border-width: ${({outlined}) => (outlined ? '1px' : undefined)};
  background-color: ${({theme, type, outlined, loading, disabled}) => {
    theme = resolveTheme(theme);

    if (loading) {
      return outlined ? undefined : theme.button[type!].bg;
    }
    if (disabled) {
      return undefined;
    }
    return outlined ? theme.bg.basic : theme.button[type ?? 'primary'].bg;
  }};
  border-color: ${({theme, type, disabled}) => {
    theme = resolveTheme(theme);

    if (disabled) {
      return theme.bg.basic;
    }
    return theme.button[type!].bg;
  }};
`;

// ButtonText Component
export const ButtonText = styled.Text<{
  outlined?: boolean;
  type?: ButtonType | SnackbarType;
  disabled?: boolean;
  loading?: boolean;
  theme?: CpkTheme;
}>`
  font-family: Pretendard;
  color: ${({theme, outlined, type, disabled}) => {
    theme = resolveTheme(theme);

    if (outlined) {
      return theme.text.basic;
    }
    if (disabled) {
      return theme.text.disabled;
    }
    return theme.button[type!].text;
  }};
`;

// CheckboxWrapperOutlined Component
export const CheckboxWrapperOutlined = styled(Animated.View)<{
  type: ButtonType;
  disabled?: boolean;
  checked?: boolean;
}>`
  border-width: 1px;
  border-color: ${({theme, type, disabled}) => {
    theme = resolveTheme(theme);

    if (disabled) {
      return theme.bg.disabled;
    }
    return type === 'light'
      ? theme.role.primary
      : theme.button[type ?? 'primary'].bg;
  }};
`;

// CheckboxWrapper Component
export const CheckboxWrapper = styled(Animated.View)<{
  type: ButtonType;
  disabled?: boolean;
  checked?: boolean;
}>`
  background-color: ${({theme, checked, type, disabled}) => {
    theme = resolveTheme(theme);

    if (disabled) {
      return undefined;
    }
    if (!checked) {
      return theme.bg.disabled;
    }
    return type === 'light'
      ? theme.role.primary
      : theme.button[type ?? 'primary'].bg;
  }};
`;

// RadioButtonWrapper Component
export const RadioButtonWrapper = styled.View<{
  type: ButtonType;
  selected?: boolean;
  disabled?: boolean;
}>`
  border-width: 1px;
  border-color: ${({theme, type, selected, disabled}) => {
    theme = resolveTheme(theme);

    if (disabled) {
      return theme.bg.disabled;
    }
    if (!selected) {
      return theme.text.basic;
    }
    return type === 'light'
      ? theme.role.primary
      : theme.button[type ?? 'primary'].bg;
  }};
`;

// RadioWrapper Component
export const RadioWrapper = styled(Animated.View)<{
  type: ButtonType;
  disabled?: boolean;
  selected?: boolean;
}>`
  background-color: ${({theme, selected, type, disabled}) => {
    theme = resolveTheme(theme);

    if (disabled) {
      return theme.bg.disabled;
    }
    if (!selected) {
      return theme.role.primary;
    }
    return theme.button[type ?? 'primary'].bg;
  }};
`;

// ColoredText Component
export const ColoredText = styled.Text<{
  type: ButtonType;
  disabled?: boolean;
  selected?: boolean;
}>`
  font-family: Pretendard;
  color: ${({theme, selected, type, disabled}) => {
    theme = resolveTheme(theme);

    if (disabled) {
      return undefined;
    }
    if (!selected) {
      return theme.text.basic;
    }
    return type === 'light'
      ? theme.role.primary
      : theme.button[type ?? 'primary'].bg;
  }};
`;

// SnackbarWrapper Component
export const SnackbarWrapper = styled(Animated.View)<{
  type?: SnackbarType;
  checked?: boolean;
}>`
  background-color: ${({theme, type}) => {
    theme = resolveTheme(theme);

    return !type ? theme.bg.disabled : theme.button[type ?? 'light'].bg;
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
