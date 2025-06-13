import type {StyleProp, ViewStyle, TextStyle} from 'react-native';

/**
 * Common size types used across components
 */
export type ComponentSize = 'small' | 'medium' | 'large';

/**
 * Common variant types for styled components
 */
export type ComponentVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'danger' 
  | 'warning' 
  | 'info' 
  | 'light' 
  | 'dark';

/**
 * Position types for various components
 */
export type Position = 'left' | 'right' | 'top' | 'bottom' | 'center';

/**
 * Common styles interface that most components should accept
 */
export interface BaseStyles {
  container?: StyleProp<ViewStyle>;
  content?: StyleProp<ViewStyle>;
  text?: StyleProp<TextStyle>;
}

/**
 * Base props that most UI components should accept
 */
export interface BaseComponentProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

/**
 * Props for components that can be pressed
 */
export interface PressableComponentProps extends BaseComponentProps {
  onPress?: () => void;
  activeOpacity?: number;
  disabled?: boolean;
}

/**
 * Animation configuration interface
 */
export interface AnimationOptions {
  duration?: number;
  delay?: number;
  useNativeDriver?: boolean;
  easing?: (value: number) => number;
}

/**
 * Accessibility props interface
 */
export interface AccessibilityProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };
}
