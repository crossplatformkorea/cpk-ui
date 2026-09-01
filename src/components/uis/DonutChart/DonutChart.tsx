import React, {useMemo, type ReactElement, type ReactNode} from 'react';
import {StyleSheet, View, type StyleProp, type ViewStyle} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';

export type DonutChartDatum = {
  key: string;
  value: number;
  color: string;
  label: string;
};

export type DonutChartProps = {
  data: readonly DonutChartDatum[];
  accessibilityLabel: string;
  children?: ReactNode;
  emptyColor?: string;
  gapDegrees?: number;
  innerRadiusRatio?: number;
  size?: number;
  startAngle?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

type Arc = DonutChartDatum & {
  endAngle: number;
  startAngle: number;
};

const DEFAULT_SIZE = 218;
const FULL_CIRCLE = 360;

function pointOnCircle(
  center: number,
  radius: number,
  angleDegrees: number,
): {x: number; y: number} {
  const radians = ((angleDegrees - 90) * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

function arcPath(
  center: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const outerStart = pointOnCircle(center, outerRadius, startAngle);
  const outerEnd = pointOnCircle(center, outerRadius, endAngle);
  const innerEnd = pointOnCircle(center, innerRadius, endAngle);
  const innerStart = pointOnCircle(center, innerRadius, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

function normalizedArcs(
  data: readonly DonutChartDatum[],
  startAngle: number,
  gapDegrees: number,
): readonly Arc[] {
  const visible = data.filter(
    ({value}) => Number.isFinite(value) && value > 0,
  );
  const total = visible.reduce((sum, datum) => sum + datum.value, 0);
  if (total <= 0) return [];

  const gap = visible.length > 1 ? Math.max(0, gapDegrees) : 0;
  const sweep = Math.max(1, FULL_CIRCLE - gap * visible.length);
  let cursor = startAngle;
  return visible.map((datum) => {
    const segmentSweep = (datum.value / total) * sweep;
    const arc = {
      ...datum,
      startAngle: cursor,
      endAngle: cursor + segmentSweep,
    };
    cursor += segmentSweep + gap;
    return arc;
  });
}

export function DonutChart({
  accessibilityLabel,
  children,
  data,
  emptyColor = 'transparent',
  gapDegrees = 3,
  innerRadiusRatio = 0.72,
  size = DEFAULT_SIZE,
  startAngle = 0,
  style,
  testID = 'donut-chart',
}: DonutChartProps): ReactElement {
  const safeSize = Math.max(1, size);
  const center = safeSize / 2;
  const outerRadius = center;
  const innerRadius = Math.min(
    outerRadius - 1,
    Math.max(1, outerRadius * innerRadiusRatio),
  );
  const arcs = useMemo(
    () => normalizedArcs(data, startAngle, gapDegrees),
    [data, gapDegrees, startAngle],
  );

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      style={[styles.container, {height: safeSize, width: safeSize}, style]}
      testID={testID}
    >
      <Svg height={safeSize} width={safeSize}>
        {arcs.length === 0 ? (
          <Circle
            cx={center}
            cy={center}
            fill="none"
            r={(outerRadius + innerRadius) / 2}
            stroke={emptyColor}
            strokeWidth={outerRadius - innerRadius}
          />
        ) : arcs.length === 1 ? (
          <Circle
            cx={center}
            cy={center}
            fill="none"
            r={(outerRadius + innerRadius) / 2}
            stroke={arcs[0]?.color}
            strokeWidth={outerRadius - innerRadius}
          />
        ) : (
          arcs.map((arc) => (
            <Path
              d={arcPath(
                center,
                outerRadius,
                innerRadius,
                arc.startAngle,
                arc.endAngle,
              )}
              fill={arc.color}
              key={arc.key}
              testID={`${testID}-segment-${arc.key}`}
            />
          ))
        )}
      </Svg>
      {children === undefined ? null : (
        <View pointerEvents="box-none" style={styles.overlay}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
