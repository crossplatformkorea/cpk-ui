import React, {type ReactNode} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {useTheme} from '../src/providers/ThemeProvider';

type StoryChildrenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function StoryHeader({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  const {theme} = useTheme();

  return (
    <View style={styles.header}>
      <Text style={[styles.title, {color: theme.text.basic}]}>{title}</Text>
      <Text style={[styles.description, {color: theme.text.label}]}>
        {description}
      </Text>
    </View>
  );
}

export function StoryCanvas({children, style}: StoryChildrenProps) {
  return (
    <ScrollView
      contentContainerStyle={[styles.canvas, style]}
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}
    >
      {children}
    </ScrollView>
  );
}

export function StoryStack({children, style}: StoryChildrenProps) {
  return <View style={[styles.stack, style]}>{children}</View>;
}

export function StoryRow({children, style}: StoryChildrenProps) {
  return <View style={[styles.row, style]}>{children}</View>;
}

export function StoryGrid({children, style}: StoryChildrenProps) {
  return <View style={[styles.grid, style]}>{children}</View>;
}

export function StorySection({
  children,
  description,
  label,
}: StoryChildrenProps & {description?: string; label: string}) {
  const {theme} = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <Text style={[styles.label, {color: theme.text.basic}]}>{label}</Text>
        {description ? (
          <Text style={[styles.sectionDescription, {color: theme.text.label}]}>
            {description}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

export function StorySpecimen({
  children,
  label,
  style,
  value,
}: StoryChildrenProps & {label: string; value?: string}) {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.specimen,
        {
          backgroundColor: theme.bg.basic,
          borderColor: theme.role.border,
        },
        style,
      ]}
    >
      <View style={styles.specimenContent}>{children}</View>
      <View style={[styles.specimenMeta, {borderTopColor: theme.role.border}]}>
        <Text style={[styles.specimenLabel, {color: theme.text.basic}]}>
          {label}
        </Text>
        {value ? (
          <Text style={[styles.specimenValue, {color: theme.text.label}]}>
            {value}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export function StorySurface({children, style}: StoryChildrenProps) {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.surface,
        {
          backgroundColor: theme.bg.basic,
          borderColor: theme.role.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function StoryText({children}: {children: ReactNode}) {
  const {theme} = useTheme();

  return (
    <Text style={[styles.text, {color: theme.text.basic}]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flexGrow: 1,
    gap: 36,
    paddingBottom: 40,
    width: '100%',
  },
  scrollView: {
    width: '100%',
  },
  header: {
    gap: 8,
    maxWidth: 680,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 31,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
  },
  stack: {
    gap: 16,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  grid: {
    alignItems: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  section: {
    gap: 14,
  },
  sectionHeading: {
    gap: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
  specimen: {
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    flexBasis: 220,
    flexGrow: 1,
    minWidth: 200,
    overflow: 'hidden',
  },
  specimenContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 112,
    padding: 20,
  },
  specimenMeta: {
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  specimenLabel: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  specimenValue: {
    fontSize: 12,
    lineHeight: 17,
  },
  surface: {
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
    padding: 20,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
});
