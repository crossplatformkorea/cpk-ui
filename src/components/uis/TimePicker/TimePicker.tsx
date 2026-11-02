import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {css} from 'kstyled';

import {useTheme} from '../../../providers/ThemeProvider';
import type {CpkTheme} from '../../../utils/theme';
import {isWeb} from '../../../utils/platform';
import {resolveLocale} from '../Calendar/intl';
import {
  displayHour,
  padTwo,
  readTimeField,
  resolveTimeFormat,
  toHours24,
  type TimePickerField,
  type TimePickerHourCycle,
} from './timeFormat';

export {
  resolveTimeFormat,
  type TimePickerFormat,
  type TimePickerHourCycle,
  type TimePickerSegment,
} from './timeFormat';

/** The resolved colour set. Every key defaults to a cpk-ui theme token. */
export type TimePickerPalette = Readonly<{
  fieldBackground: string;
  fieldBorder: string;
  focusedFieldBorder: string;
  text: string;
  separator: string;
  selectedBackground: string;
  selectedText: string;
  unselectedText: string;
  disabledText: string;
}>;

export type TimePickerColors = Partial<TimePickerPalette>;

/** Screen reader names. Defaults come from `Intl.DisplayNames` where the runtime has it. */
export type TimePickerLabels = {
  hour?: string;
  minute?: string;
  dayPeriod?: string;
};

export type TimePickerStyles = {
  container?: StyleProp<ViewStyle>;
  field?: StyleProp<TextStyle>;
  focusedField?: StyleProp<TextStyle>;
  separator?: StyleProp<TextStyle>;
  dayPeriod?: StyleProp<ViewStyle>;
  dayPeriodOption?: StyleProp<ViewStyle>;
  selectedDayPeriodOption?: StyleProp<ViewStyle>;
  dayPeriodText?: StyleProp<TextStyle>;
};

export type TimePickerProps = {
  /** Only the hours and minutes are read. The date part is kept on change. */
  value: Date;
  /**
   * Fires with a copy of `value` carrying the new hours and minutes, seconds zeroed,
   * whenever a typed digit or a day period press forms a valid time.
   */
  onChange?: (date: Date) => void;
  /** BCP-47 tag. Decides the hour cycle, separator, order and day period words. */
  locale?: string;
  /** Overrides the locale's hour cycle. */
  hourCycle?: TimePickerHourCycle;
  disabled?: boolean;
  colors?: TimePickerColors;
  labels?: TimePickerLabels;
  /** Multiplier cap applied to every text node. */
  maxFontSizeMultiplier?: number;
  style?: StyleProp<ViewStyle>;
  styles?: TimePickerStyles;
  /** Prefix for `-hour`, `-minute`, `-am` and `-pm`. */
  testID?: string;
};

export function resolveTimePickerPalette(
  theme: CpkTheme,
  colors?: TimePickerColors,
): TimePickerPalette {
  return Object.freeze({
    fieldBackground: colors?.fieldBackground ?? theme.bg.basic,
    fieldBorder: colors?.fieldBorder ?? theme.role.border,
    focusedFieldBorder: colors?.focusedFieldBorder ?? theme.role.primary,
    text: colors?.text ?? theme.text.basic,
    separator: colors?.separator ?? theme.text.label,
    selectedBackground: colors?.selectedBackground ?? theme.role.primary,
    selectedText: colors?.selectedText ?? theme.text.contrast,
    unselectedText: colors?.unselectedText ?? theme.text.label,
    disabledText: colors?.disabledText ?? theme.text.disabled,
  });
}

type DisplayNamesLike = {of: (code: string) => string | undefined};
type DisplayNamesConstructor = new (
  locales: string[],
  options: {type: 'dateTimeField'},
) => DisplayNamesLike;

const FALLBACK_LABELS: Required<TimePickerLabels> = {
  hour: 'Hour',
  minute: 'Minute',
  dayPeriod: 'AM/PM',
};

function defaultLabels(locale: string): Required<TimePickerLabels> {
  const DisplayNames = (
    Intl as unknown as {DisplayNames?: DisplayNamesConstructor}
  ).DisplayNames;

  if (typeof DisplayNames !== 'function') {
    return FALLBACK_LABELS;
  }

  try {
    const names = new DisplayNames([locale], {type: 'dateTimeField'});

    return {
      hour: names.of('hour') ?? FALLBACK_LABELS.hour,
      minute: names.of('minute') ?? FALLBACK_LABELS.minute,
      dayPeriod: names.of('dayPeriod') ?? FALLBACK_LABELS.dayPeriod,
    };
  } catch {
    return FALLBACK_LABELS;
  }
}

const ROW = css`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const CLOCK = css`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const FIELD = css`
  min-height: 44px;
  padding: 6px 8px;
  border-width: 1px;
  border-radius: 10px;
`;

const DAY_PERIOD = css`
  flex-direction: row;
  border-width: 1px;
  border-radius: 10px;
  overflow: hidden;
`;

const DAY_PERIOD_OPTION = css`
  min-width: 48px;
  min-height: 44px;
  padding: 6px 10px;
  align-items: center;
  justify-content: center;
`;

const FIELD_FONT_SIZE = 20;

const textStyles = StyleSheet.create({
  field: {
    fontFamily: 'Pretendard',
    fontSize: FIELD_FONT_SIZE,
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
    lineHeight: 26,
    textAlign: 'center',
  },
  separator: {
    fontFamily: 'Pretendard',
    fontSize: 20,
    lineHeight: 26,
  },
  dayPeriod: {
    fontFamily: 'Pretendard',
    fontSize: 15,
    lineHeight: 20,
  },
});

const WEB_FIELD = {outlineWidth: 0} as TextStyle;

/**
 * Two tabular digits plus padding and border at the current font scale. A web
 * input otherwise takes the browser's ~20 character intrinsic width.
 */
function timePickerFieldWidth(fontScale: number): number {
  return Math.max(52, Math.ceil(FIELD_FONT_SIZE * fontScale * 1.3 + 18));
}

function TimePickerContainer({
  value,
  onChange,
  locale: localeProp,
  hourCycle: hourCycleProp,
  disabled = false,
  colors,
  labels: labelsProp,
  maxFontSizeMultiplier = 1.6,
  style,
  styles,
  testID = 'time-picker',
}: TimePickerProps): ReactElement {
  const {theme} = useTheme();
  const {fontScale} = useWindowDimensions();
  const fieldWidth = timePickerFieldWidth(
    Math.min(fontScale, maxFontSizeMultiplier),
  );
  const locale = useMemo(() => localeProp ?? resolveLocale(), [localeProp]);
  const format = useMemo(
    () => resolveTimeFormat(locale, hourCycleProp),
    [locale, hourCycleProp],
  );
  const palette = useMemo(
    () => resolveTimePickerPalette(theme, colors),
    [theme, colors],
  );
  const labels = useMemo(
    () => ({...defaultLabels(locale), ...labelsProp}),
    [locale, labelsProp],
  );
  const [focused, setFocused] = useState<TimePickerField | null>(null);
  const [draft, setDraft] = useState('');
  const minuteRef = useRef<TextInput>(null);

  const hours = value.getHours();
  const minutes = value.getMinutes();
  const isAfternoon = hours >= 12;
  const hourText = format.padHour
    ? padTwo(displayHour(hours, format.hourCycle))
    : String(displayHour(hours, format.hourCycle));
  const minuteText = padTwo(minutes);

  const commit = useCallback(
    (nextHours: number, nextMinutes: number): void => {
      if (nextHours === hours && nextMinutes === minutes) {
        return;
      }

      const next = new Date(value.getTime());
      next.setHours(nextHours, nextMinutes, 0, 0);
      onChange?.(next);
    },
    [hours, minutes, onChange, value],
  );

  const handleChangeText = useCallback(
    (field: TimePickerField, text: string): void => {
      const entry = readTimeField(text, field, format.hourCycle);

      if (!entry) {
        return;
      }

      setDraft(entry.draft);

      if (entry.value !== null) {
        if (field === 'hour') {
          commit(
            toHours24(entry.value, format.hourCycle, isAfternoon),
            minutes,
          );
        } else {
          commit(hours, entry.value);
        }
      }

      if (field === 'hour' && entry.complete) {
        minuteRef.current?.focus();
      }
    },
    [commit, format.hourCycle, hours, isAfternoon, minutes],
  );

  const handleFocus = useCallback(
    (field: TimePickerField): void => {
      setFocused(field);
      setDraft(field === 'hour' ? hourText : minuteText);
    },
    [hourText, minuteText],
  );

  const handleBlur = useCallback((field: TimePickerField): void => {
    setFocused((current) => (current === field ? null : current));
  }, []);

  const chooseDayPeriod = useCallback(
    (afternoon: boolean): void => {
      if (disabled || afternoon === isAfternoon) {
        return;
      }

      commit(afternoon ? hours + 12 : hours - 12, minutes);
    },
    [commit, disabled, hours, isAfternoon, minutes],
  );

  const textColor = disabled ? palette.disabledText : palette.text;

  const renderField = (field: TimePickerField): ReactElement => {
    const isFocused = focused === field;

    return (
      <TextInput
        accessibilityLabel={labels[field]}
        accessibilityState={{disabled}}
        editable={!disabled}
        keyboardType="number-pad"
        maxFontSizeMultiplier={maxFontSizeMultiplier}
        maxLength={2}
        onBlur={() => handleBlur(field)}
        onChangeText={(text) => handleChangeText(field, text)}
        onFocus={() => handleFocus(field)}
        ref={field === 'minute' ? minuteRef : undefined}
        returnKeyType="done"
        selectTextOnFocus
        selectionColor={palette.focusedFieldBorder}
        style={[
          FIELD,
          textStyles.field,
          {
            backgroundColor: palette.fieldBackground,
            borderColor: isFocused
              ? palette.focusedFieldBorder
              : palette.fieldBorder,
            color: textColor,
            width: fieldWidth,
          },
          isWeb() && WEB_FIELD,
          styles?.field,
          isFocused && styles?.focusedField,
        ]}
        testID={`${testID}-${field}`}
        value={isFocused ? draft : field === 'hour' ? hourText : minuteText}
      />
    );
  };

  const clock = (
    <View key="clock" style={CLOCK}>
      {format.order
        .filter((segment) => segment !== 'dayPeriod')
        .map((segment, index) => (
          <React.Fragment key={segment}>
            {index > 0 ? (
              <Text
                maxFontSizeMultiplier={maxFontSizeMultiplier}
                style={[
                  textStyles.separator,
                  {color: disabled ? palette.disabledText : palette.separator},
                  styles?.separator,
                ]}
              >
                {format.separator}
              </Text>
            ) : null}
            {renderField(segment as TimePickerField)}
          </React.Fragment>
        ))}
    </View>
  );

  const dayPeriod =
    format.hourCycle === 'h12' ? (
      <View
        accessibilityLabel={labels.dayPeriod}
        accessibilityRole="radiogroup"
        key="dayPeriod"
        style={[
          DAY_PERIOD,
          {borderColor: palette.fieldBorder},
          styles?.dayPeriod,
        ]}
      >
        {format.dayPeriods.map((word, index) => {
          const afternoon = index === 1;
          const selected = afternoon === isAfternoon;

          return (
            <Pressable
              accessibilityLabel={word}
              accessibilityRole="radio"
              accessibilityState={{checked: selected, disabled}}
              disabled={disabled}
              key={word}
              onPress={() => chooseDayPeriod(afternoon)}
              style={[
                DAY_PERIOD_OPTION,
                {
                  backgroundColor: selected
                    ? palette.selectedBackground
                    : palette.fieldBackground,
                },
                styles?.dayPeriodOption,
                selected && styles?.selectedDayPeriodOption,
              ]}
              testID={`${testID}-${afternoon ? 'pm' : 'am'}`}
            >
              <Text
                maxFontSizeMultiplier={maxFontSizeMultiplier}
                style={[
                  textStyles.dayPeriod,
                  {
                    color: disabled
                      ? palette.disabledText
                      : selected
                        ? palette.selectedText
                        : palette.unselectedText,
                    fontWeight: selected ? '600' : '400',
                  },
                  styles?.dayPeriodText,
                ]}
              >
                {word}
              </Text>
            </Pressable>
          );
        })}
      </View>
    ) : null;

  const dayPeriodFirst =
    format.order.indexOf('dayPeriod') >= 0 &&
    format.order.indexOf('dayPeriod') < format.order.indexOf('hour');

  return (
    <View style={[ROW, style, styles?.container]} testID={testID}>
      {dayPeriodFirst ? [dayPeriod, clock] : [clock, dayPeriod]}
    </View>
  );
}

export const TimePicker = React.memo(TimePickerContainer);

export default TimePicker;
