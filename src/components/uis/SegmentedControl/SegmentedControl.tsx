import React, {useCallback, useMemo, type ReactElement} from 'react';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {styled, css} from 'kstyled';

import {useTheme} from '../../../providers/ThemeProvider';
import {Typography} from '../Typography/Typography';
import type {CpkTheme} from '../../../utils/theme';

export type SegmentedControlSizeType = 'small' | 'medium' | 'large' | number;
export type SegmentedControlColorType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light';

export type SegmentedControlItem = {
  value: string | number;
  text: string | ReactElement;
};

type Styles = {
  container?: StyleProp<ViewStyle>;
  segment?: StyleProp<ViewStyle>;
  selectedSegment?: StyleProp<ViewStyle>;
  text?: StyleProp<TextStyle>;
  selectedText?: StyleProp<TextStyle>;
};

export type SegmentedControlProps = {
  testID?: string;
  values: SegmentedControlItem[];
  selectedValue: string | number;
  onValueChange?: (value: string | number) => void;
  color?: SegmentedControlColorType;
  size?: SegmentedControlSizeType;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  styles?: Styles;
  borderRadius?: number;
};

const Container = styled.View`
  overflow: hidden;
`;

// Calculate styles based on theme and props
const calculateStyles = ({
  theme,
  color,
  size,
  borderRadius,
  styles,
}: {
  theme: CpkTheme;
  color: SegmentedControlColorType;
  size: SegmentedControlSizeType;
  borderRadius: number;
  styles?: Styles;
}) => {
  const padding =
    typeof size === 'number'
      ? `${size * 0.4}px ${size * 0.8}px`
      : size === 'large'
        ? '12px 16px'
        : size === 'medium'
          ? '8px 12px'
          : size === 'small'
            ? '6px 8px'
            : '8px 12px';

  return {
    wrapper: [
      css`
        flex-direction: row;
        background-color: ${theme.bg.paper};
        border-top-color: ${theme.bg.disabled};
        border-bottom-color: ${theme.bg.disabled};
        border-left-color: ${theme.bg.disabled};
        border-right-color: ${theme.bg.disabled};
        border-width: 1px;
        border-radius: ${borderRadius}px;
      `,
    ],
    container: styles?.container,
    segment: [
      css`
        flex: 1;
        align-items: center;
        justify-content: center;
        padding: ${padding};
        background-color: transparent;
      `,
      styles?.segment,
    ],
    selectedSegment: [
      css`
        background-color: ${theme.button[color].bg};
      `,
      styles?.selectedSegment,
    ],
    text: [
      css`
        color: ${theme.text.basic};
      `,
      styles?.text,
    ],
    selectedText: [
      css`
        color: ${theme.button[color].text};
        font-weight: 600;
      `,
      styles?.selectedText,
    ],
  };
};

function SegmentedControlContainer({
  testID,
  values,
  selectedValue,
  onValueChange,
  color = 'primary',
  size = 'medium',
  disabled = false,
  style,
  styles,
  borderRadius = 8,
}: SegmentedControlProps): ReactElement {
  const {theme} = useTheme();

  // Memoize styles calculation
  const compositeStyles = useMemo(
    () =>
      calculateStyles({
        theme,
        color,
        size,
        borderRadius,
        styles,
      }),
    [theme, color, size, borderRadius, styles],
  );

  // Memoize segment press handler
  const handlePress = useCallback(
    (value: string | number) => {
      if (!disabled) {
        onValueChange?.(value);
      }
    },
    [disabled, onValueChange],
  );

  // Memoize segments rendering
  const segments = useMemo(
    () =>
      values.map((item: SegmentedControlItem, index: number) => {
        const isSelected = selectedValue === item.value;
        const isFirst = index === 0;
        const isLast = index === values.length - 1;

        return (
          <TouchableOpacity
            key={`segment-${index}`}
            testID={`segment-${index}`}
            activeOpacity={0.7}
            disabled={disabled}
            onPress={() => handlePress(item.value)}
            style={[
              compositeStyles.segment,
              isSelected && compositeStyles.selectedSegment,
              {
                borderTopLeftRadius: isFirst ? borderRadius - 1 : 0,
                borderBottomLeftRadius: isFirst ? borderRadius - 1 : 0,
                borderTopRightRadius: isLast ? borderRadius - 1 : 0,
                borderBottomRightRadius: isLast ? borderRadius - 1 : 0,
                borderRightWidth: isLast ? 0 : 1,
                borderRightColor: theme.bg.disabled,
              },
            ]}
          >
            {typeof item.text === 'string' ? (
              <Typography.Body2
                style={[
                  compositeStyles.text,
                  isSelected && compositeStyles.selectedText,
                ]}
              >
                {item.text}
              </Typography.Body2>
            ) : (
              item.text
            )}
          </TouchableOpacity>
        );
      }),
    [
      values,
      selectedValue,
      disabled,
      handlePress,
      compositeStyles,
      borderRadius,
      theme.bg.disabled,
    ],
  );

  return (
    <Container style={style} testID={testID}>
      <Container style={[compositeStyles.wrapper, compositeStyles.container]}>
        {segments}
      </Container>
    </Container>
  );
}

// Export memoized component for better performance
export const SegmentedControl = React.memo(
  SegmentedControlContainer,
);

export default SegmentedControl;
