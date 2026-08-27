import React, {useMemo, useState, type ReactElement} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, {
  Circle,
  G,
  Line,
  Path,
  Rect,
  Text as SvgText,
} from 'react-native-svg';

import {useTheme} from '../../../providers/ThemeProvider';

export type LineChartDatum = {
  key: string;
  value: number;
  label: string;
  accessibilityLabel?: string;
};

export type LineChartPalette = {
  line: string;
  point: string;
  selectedPoint: string;
  grid: string;
  label: string;
  tooltipBackground: string;
  tooltipText: string;
};

export type LineChartStyles = {
  container?: StyleProp<ViewStyle>;
  chart?: StyleProp<ViewStyle>;
};

export type LineChartProps = {
  data: readonly LineChartDatum[];
  selectedKey?: string;
  onSelect?: (datum: LineChartDatum, index: number) => void;
  formatValue?: (value: number) => string;
  palette?: Partial<LineChartPalette>;
  variant?: 'compact' | 'regular';
  showGrid?: boolean;
  emptyLabel?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  styles?: LineChartStyles;
  testID?: string;
};

type ChartPoint = LineChartDatum & {x: number; y: number; index: number};

const DEFAULT_WIDTH = 320;
const REGULAR_HEIGHT = 220;
const COMPACT_HEIGHT = 160;
const HORIZONTAL_INSET = 20;
const TOP_INSET = 30;
const BOTTOM_INSET = 30;

function safeNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function makePath(points: readonly ChartPoint[]): string {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
}

export function LineChart({
  data,
  selectedKey,
  onSelect,
  formatValue = String,
  palette,
  variant = 'regular',
  showGrid = true,
  emptyLabel = 'No data',
  accessibilityLabel,
  style,
  styles,
  testID = 'line-chart',
}: LineChartProps): ReactElement {
  const {theme} = useTheme();
  const defaultHeight = variant === 'compact' ? COMPACT_HEIGHT : REGULAR_HEIGHT;
  const [frame, setFrame] = useState({
    height: defaultHeight,
    width: DEFAULT_WIDTH,
  });
  const colors: LineChartPalette = {
    line: palette?.line ?? theme.role.success,
    point: palette?.point ?? theme.bg.basic,
    selectedPoint: palette?.selectedPoint ?? theme.role.success,
    grid: palette?.grid ?? theme.role.border,
    label: palette?.label ?? theme.text.label,
    tooltipBackground: palette?.tooltipBackground ?? theme.role.primary,
    tooltipText: palette?.tooltipText ?? theme.text.contrast,
  };
  const points = useMemo(() => {
    if (data.length === 0) return [];
    const values = data.map((datum) => safeNumber(datum.value));
    const minimum = Math.min(0, ...values);
    const maximum = Math.max(0, ...values);
    const range = maximum - minimum || 1;
    const innerWidth = Math.max(1, frame.width - HORIZONTAL_INSET * 2);
    const innerHeight = Math.max(1, frame.height - TOP_INSET - BOTTOM_INSET);

    return data.map<ChartPoint>((datum, index) => ({
      ...datum,
      index,
      x:
        HORIZONTAL_INSET +
        (data.length === 1
          ? innerWidth / 2
          : (innerWidth * index) / (data.length - 1)),
      y:
        TOP_INSET + ((maximum - safeNumber(datum.value)) / range) * innerHeight,
    }));
  }, [data, frame.height, frame.width]);
  const selectedPoint = points.find((point) => point.key === selectedKey);
  const slotWidth = frame.width / Math.max(1, data.length);
  const onLayout = ({nativeEvent}: LayoutChangeEvent): void => {
    const {height, width} = nativeEvent.layout;
    if (height > 0 && width > 0) setFrame({height, width});
  };

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      onLayout={onLayout}
      style={[
        componentStyles.container,
        {height: defaultHeight},
        styles?.container,
        style,
      ]}
      testID={testID}
    >
      <View style={[StyleSheet.absoluteFill, styles?.chart]}>
        <Svg height="100%" width="100%">
          {showGrid
            ? [0, 1, 2, 3].map((index) => {
                const y =
                  TOP_INSET +
                  ((frame.height - TOP_INSET - BOTTOM_INSET) * index) / 3;
                return (
                  <Line
                    key={`grid-${index}`}
                    stroke={colors.grid}
                    strokeDasharray="3 4"
                    strokeWidth={StyleSheet.hairlineWidth}
                    x1={HORIZONTAL_INSET}
                    x2={frame.width - HORIZONTAL_INSET}
                    y1={y}
                    y2={y}
                  />
                );
              })
            : null}
          {points.length > 1 ? (
            <Path
              d={makePath(points)}
              fill="none"
              stroke={colors.line}
              strokeLinejoin="round"
              strokeWidth={2.5}
            />
          ) : null}
          {points.map((point) => {
            const selected = point.key === selectedKey;
            return (
              <G key={point.key}>
                <Circle
                  cx={point.x}
                  cy={point.y}
                  fill={selected ? colors.selectedPoint : colors.point}
                  r={selected ? 5 : 3.5}
                  stroke={colors.line}
                  strokeWidth={2}
                />
                <SvgText
                  fill={colors.label}
                  fontSize={10}
                  textAnchor="middle"
                  x={point.x}
                  y={frame.height - 8}
                >
                  {point.label}
                </SvgText>
              </G>
            );
          })}
          {selectedPoint ? (
            <G>
              <Rect
                fill={colors.tooltipBackground}
                height={26}
                rx={6}
                width={88}
                x={Math.min(
                  Math.max(selectedPoint.x - 44, 4),
                  frame.width - 92,
                )}
                y={Math.max(2, selectedPoint.y - 36)}
              />
              <SvgText
                fill={colors.tooltipText}
                fontSize={11}
                fontWeight="600"
                textAnchor="middle"
                x={Math.min(Math.max(selectedPoint.x, 48), frame.width - 48)}
                y={Math.max(19, selectedPoint.y - 19)}
              >
                {formatValue(selectedPoint.value)}
              </SvgText>
            </G>
          ) : null}
          {points.length === 0 ? (
            <SvgText
              fill={colors.label}
              fontSize={13}
              textAnchor="middle"
              testID={`${testID}-empty`}
              x={frame.width / 2}
              y={frame.height / 2}
            >
              {emptyLabel}
            </SvgText>
          ) : null}
        </Svg>
      </View>
      {points.map((point) => (
        <Pressable
          accessibilityLabel={
            point.accessibilityLabel ??
            `${point.label}: ${formatValue(point.value)}`
          }
          accessibilityRole="button"
          accessibilityState={{selected: point.key === selectedKey}}
          key={`target-${point.key}`}
          onPress={() => {
            const datum = data[point.index];
            if (datum) onSelect?.(datum, point.index);
          }}
          style={[
            componentStyles.target,
            {left: slotWidth * point.index, width: slotWidth},
          ]}
          testID={`${testID}-point-${point.index}`}
        />
      ))}
    </View>
  );
}

const componentStyles = StyleSheet.create({
  container: {alignSelf: 'stretch', minWidth: 1},
  target: {bottom: 0, position: 'absolute', top: 0},
});
