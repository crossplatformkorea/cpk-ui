import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AccessibilityInfo, AppState} from 'react-native';

import type {
  CalendarDateKey,
  CalendarDisabledResolver,
  CalendarViewMode,
  WeekStart,
} from './types';
import {
  addDays,
  addMonths,
  fromDayKey,
  isSameDay,
  localNoon,
  startOfWeek,
  toDateKeyInput,
  toDayKey,
} from './utils';

/**
 * Controlled first: the prop wins whenever it is not `undefined`, and the internal
 * state is only used as the uncontrolled fallback.
 */
export function useControllable<T>(
  controlled: T | undefined,
  initial: T,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(initial);
  const isControlled = controlled !== undefined;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternal(next);
      }
    },
    [isControlled],
  );

  return [isControlled ? controlled : internal, setValue];
}

/**
 * "Today" as a local noon date that re-arms itself at local midnight and also
 * refreshes when the app returns to the foreground, so a device that slept through
 * midnight still moves the highlight.
 */
export function useToday(explicit?: Date | CalendarDateKey): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (explicit !== undefined) {
      return;
    }

    let timerId: ReturnType<typeof setTimeout> | undefined;

    const refresh = (): void => {
      setNow((previous) => {
        const next = new Date();

        return isSameDay(previous, next) ? previous : next;
      });
    };

    const armMidnightTimer = (): void => {
      const midnight = new Date();

      midnight.setHours(24, 0, 0, 500);

      timerId = setTimeout(
        () => {
          refresh();
          armMidnightTimer();
        },
        Math.max(midnight.getTime() - Date.now(), 0),
      );
    };

    armMidnightTimer();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refresh();
      }
    });

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }

      subscription.remove();
    };
  }, [explicit]);

  const source =
    typeof explicit === 'string' ? fromDayKey(explicit) : (explicit ?? now);

  return useMemo(
    () => localNoon(source.getFullYear(), source.getMonth(), source.getDate()),
    [source],
  );
}

/** Every spring and timing in the component collapses to duration 0 when this is on. */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);
  const currentRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    // Only ever schedules a render when the setting actually differs.
    const apply = (enabled: boolean): void => {
      if (!mounted || currentRef.current === enabled) {
        return;
      }

      currentRef.current = enabled;
      setReduceMotion(enabled);
    };

    AccessibilityInfo.isReduceMotionEnabled()
      .then(apply)
      .catch(() => undefined);

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      apply,
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}

let disabledVersionSeq = 0;

export type CalendarDisabledState = {
  resolver: CalendarDisabledResolver;
  version: number;
  minKey: CalendarDateKey | null;
  maxKey: CalendarDateKey | null;
};

/**
 * Precedence, first match wins:
 * `marker.disabled` → `disabledDates` → `minDate`/`maxDate` → `isDateDisabled`.
 * Range checks are lexicographic string compares, which are allocation free and
 * timezone proof because `yyyy-MM-dd` sorts chronologically.
 */
export function useDisabledState(args: {
  minDate?: Date | CalendarDateKey;
  maxDate?: Date | CalendarDateKey;
  disabledDates?: ReadonlySet<CalendarDateKey> | readonly CalendarDateKey[];
  isDateDisabled?: (date: Date, key: CalendarDateKey) => boolean;
}): CalendarDisabledState {
  const {minDate, maxDate, disabledDates, isDateDisabled} = args;

  const minKey = minDate == null ? null : toDateKeyInput(minDate);
  const maxKey = maxDate == null ? null : toDateKeyInput(maxDate);

  const disabledSet = useMemo<ReadonlySet<CalendarDateKey> | null>(() => {
    if (!disabledDates) {
      return null;
    }

    return Array.isArray(disabledDates)
      ? new Set<CalendarDateKey>(disabledDates)
      : (disabledDates as ReadonlySet<CalendarDateKey>);
  }, [disabledDates]);

  const version = useMemo(() => {
    disabledVersionSeq += 1;

    return disabledVersionSeq;
  }, [minKey, maxKey, disabledSet, isDateDisabled]);

  const resolver = useCallback<CalendarDisabledResolver>(
    (day, marker) => {
      if (marker?.disabled === true) {
        return true;
      }

      if (disabledSet?.has(day.key)) {
        return true;
      }

      if (minKey !== null && day.key < minKey) {
        return true;
      }

      if (maxKey !== null && day.key > maxKey) {
        return true;
      }

      if (isDateDisabled) {
        return isDateDisabled(day.date, day.key);
      }

      return false;
    },
    [disabledSet, isDateDisabled, maxKey, minKey],
  );

  return {resolver, version, minKey, maxKey};
}

export type CalendarKeyboardAction =
  | {type: 'move'; key: CalendarDateKey}
  | {type: 'select'}
  | null;

/**
 * One handler covers the whole grid. Moving past a page edge simply targets a day
 * outside the mounted page, and the caller pages to it while keeping focus.
 */
export function resolveKeyboardAction(args: {
  key: string;
  shiftKey: boolean;
  focusedKey: CalendarDateKey;
  weekStart: WeekStart;
  isRTL: boolean;
  mode: CalendarViewMode;
}): CalendarKeyboardAction {
  const {key, shiftKey, focusedKey, weekStart, isRTL, mode} = args;
  const focused = fromDayKey(focusedKey);
  const horizontal = isRTL ? -1 : 1;
  const move = (date: Date): CalendarKeyboardAction => ({
    type: 'move',
    key: toDayKey(date),
  });

  switch (key) {
    case 'ArrowLeft':
      return move(addDays(focused, -horizontal));
    case 'ArrowRight':
      return move(addDays(focused, horizontal));
    case 'ArrowUp':
      return move(addDays(focused, -7));
    case 'ArrowDown':
      return move(addDays(focused, 7));
    case 'Home':
      return move(startOfWeek(focused, weekStart));
    case 'End':
      return move(addDays(startOfWeek(focused, weekStart), 6));
    case 'PageUp':
      return shiftKey
        ? move(addMonths(focused, -12))
        : move(mode === 'week' ? addDays(focused, -7) : addMonths(focused, -1));
    case 'PageDown':
      return shiftKey
        ? move(addMonths(focused, 12))
        : move(mode === 'week' ? addDays(focused, 7) : addMonths(focused, 1));
    case 'Enter':
    case ' ':
    case 'Spacebar':
      return {type: 'select'};
    default:
      return null;
  }
}

const isShallowEqual = (a?: object, b?: object): boolean => {
  if (a === b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const key of aKeys) {
    if (
      (a as Record<string, unknown>)[key] !==
      (b as Record<string, unknown>)[key]
    ) {
      return false;
    }
  }

  return true;
};

/**
 * Keeps the previous object for as long as a SHALLOW value compare says nothing
 * changed.
 *
 * `labels`, `styles` and `formatters` are written as inline object literals at
 * almost every call site — `labels={{today: t('calendar.today')}}` is the only
 * way to localize the component — and a fresh identity there invalidates
 * `chrome`, which re-renders all 42 day cells on every parent render. `palette`
 * already compared by value for exactly this reason; these three did not.
 *
 * One level deep only. A caller writing `styles={{dayText: {fontWeight: '600'}}}`
 * fully inline still allocates a new nested object every render and still pays;
 * hoist the inner style object or wrap it in `useMemo`.
 */
export function useShallowStable<T extends object | undefined>(value: T): T {
  const ref = useRef<T>(value);

  return useMemo(() => {
    if (!isShallowEqual(ref.current, value)) {
      ref.current = value;
    }

    return ref.current;
  }, [value]);
}
