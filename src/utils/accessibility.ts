import type {AccessibilityProps} from '../types/common';

/**
 * Generate accessibility props for button-like components
 */
export function getButtonAccessibilityProps(
  label: string,
  disabled?: boolean,
  pressed?: boolean,
): AccessibilityProps {
  return {
    accessibilityRole: 'button',
    accessibilityLabel: label,
    accessibilityState: {
      disabled: disabled ?? false,
      ...(pressed !== undefined && {selected: pressed}),
    },
  };
}

/**
 * Generate accessibility props for checkbox components
 */
export function getCheckboxAccessibilityProps(
  label: string,
  checked: boolean,
  disabled?: boolean,
): AccessibilityProps {
  return {
    accessibilityRole: 'checkbox',
    accessibilityLabel: label,
    accessibilityState: {
      checked,
      disabled: disabled ?? false,
    },
  };
}

/**
 * Generate accessibility props for radio button components
 */
export function getRadioAccessibilityProps(
  label: string,
  selected: boolean,
  disabled?: boolean,
): AccessibilityProps {
  return {
    accessibilityRole: 'radio',
    accessibilityLabel: label,
    accessibilityState: {
      selected,
      disabled: disabled ?? false,
    },
  };
}

/**
 * Generate accessibility props for text input components
 */
export function getTextInputAccessibilityProps(
  label: string,
  placeholder?: string,
  required?: boolean,
  invalid?: boolean,
): AccessibilityProps {
  return {
    accessibilityRole: 'text',
    accessibilityLabel: label,
    accessibilityHint: placeholder,
    accessibilityState: {
      ...(required && {busy: true}),
      ...(invalid && {selected: false}),
    },
  };
}

/**
 * Generate accessibility props for switch/toggle components
 */
export function getSwitchAccessibilityProps(
  label: string,
  value: boolean,
  disabled?: boolean,
): AccessibilityProps {
  return {
    accessibilityRole: 'switch',
    accessibilityLabel: label,
    accessibilityState: {
      checked: value,
      disabled: disabled ?? false,
    },
  };
}

/**
 * Generate accessibility props for expandable components (like Accordion)
 */
export function getExpandableAccessibilityProps(
  label: string,
  expanded: boolean,
): AccessibilityProps {
  return {
    accessibilityRole: 'button',
    accessibilityLabel: label,
    accessibilityState: {
      expanded,
    },
    accessibilityHint: expanded ? 'Double tap to collapse' : 'Double tap to expand',
  };
}
