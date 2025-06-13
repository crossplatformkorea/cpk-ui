import {Platform} from 'react-native';

/**
 * Safely check if current platform is web
 * Prevents undefined Platform.OS errors during testing
 */
export function isWeb(): boolean {
  try {
    return Platform.OS === 'web';
  } catch {
    return false;
  }
}

/**
 * Safely check if current platform is iOS
 */
export function isIOS(): boolean {
  try {
    return Platform.OS === 'ios';
  } catch {
    return false;
  }
}

/**
 * Safely check if current platform is Android
 */
export function isAndroid(): boolean {
  try {
    return Platform.OS === 'android';
  } catch {
    return false;
  }
}

/**
 * Safe wrapper for Platform.select
 * Provides fallback when Platform.OS is undefined
 */
export function safePlatformSelect<T>(options: {
  web?: T;
  ios?: T;
  android?: T;
  native?: T;
  default?: T;
}): T | undefined {
  try {
    const platformSelect = Platform.select(options);
    return platformSelect ?? options.default;
  } catch {
    return options.default;
  }
}

/**
 * Get safe platform-specific values
 */
export function getPlatformValue<T>(
  webValue: T,
  nativeValue: T,
  fallback: T,
): T {
  try {
    return Platform.OS === 'web' ? webValue : nativeValue;
  } catch {
    return fallback;
  }
}
