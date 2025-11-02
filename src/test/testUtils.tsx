import {render, fireEvent, waitFor} from '@testing-library/react-native';
import React, {type ReactElement} from 'react';
import {CpkProvider} from '../providers';
import {light as lightTheme} from '../utils/colors';

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options: {
    theme?: 'light' | 'dark';
    initialTheme?: typeof lightTheme;
  } = {},
) {
  const {theme = 'light', initialTheme} = options;

  const Wrapper = ({children}: {children: ReactElement}) => (
    <CpkProvider>{children}</CpkProvider>
  );

  return render(ui, {wrapper: Wrapper});
}

/**
 * Test helper for checking accessibility properties
 */
export function expectAccessibilityProps(
  element: any,
  expectedProps: {
    role?: string;
    label?: string;
    hint?: string;
    state?: Record<string, any>;
  },
) {
  const {role, label, hint, state} = expectedProps;

  if (role) {
    expect(element.props.accessibilityRole).toBe(role);
  }

  if (label) {
    expect(element.props.accessibilityLabel).toBe(label);
  }

  if (hint) {
    expect(element.props.accessibilityHint).toBe(hint);
  }

  if (state) {
    expect(element.props.accessibilityState).toEqual(
      expect.objectContaining(state),
    );
  }
}

/**
 * Test helper for animation testing
 */
export async function waitForAnimation(duration: number = 300) {
  await waitFor(() => {}, {timeout: duration + 100});
}

/**
 * Test helper for press events with different delays
 */
export async function pressWithDelay(
  element: any,
  delay: number = 0,
): Promise<void> {
  fireEvent.press(element);
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

/**
 * Mock platform for testing
 */
export function mockPlatform(platform: 'ios' | 'android' | 'web') {
  const originalPlatform = require('react-native').Platform.OS;

  beforeEach(() => {
    require('react-native').Platform.OS = platform;
  });

  afterEach(() => {
    require('react-native').Platform.OS = originalPlatform;
  });
}

/**
 * Test performance of component renders
 */
export function measureRenderTime(renderFn: () => void): number {
  const startTime = performance.now();
  renderFn();
  const endTime = performance.now();
  return endTime - startTime;
}
