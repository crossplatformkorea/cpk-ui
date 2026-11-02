import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {CpkProvider} from '../providers';
import {Button} from '../components/uis/Button/Button';
import {Calendar} from '../components/uis/Calendar/Calendar';
import type {CalendarMarkerMap} from '../components/uis/Calendar/types';
import {DonutChart} from '../components/uis/DonutChart/DonutChart';
import {Icon} from '../components/uis/Icon/Icon';
import {LineChart} from '../components/uis/LineChart/LineChart';
import {Typography} from '../components/uis/Typography/Typography';
import {useTheme} from '../providers/ThemeProvider';

const TODAY = new Date(2026, 10, 2, 12);

const MARKERS: CalendarMarkerMap = Object.freeze({
  '2026-11-02': Object.freeze({
    dots: Object.freeze([{key: 'expense'}]),
    accessibilityHint: '지출 2건',
  }),
  '2026-11-05': Object.freeze({
    dots: Object.freeze([{key: 'income'}, {key: 'expense'}]),
    accessibilityHint: '수입 1건, 지출 1건',
  }),
  '2026-11-11': Object.freeze({
    dots: Object.freeze([{key: 'expense'}]),
    accessibilityHint: '지출 1건',
  }),
});

const SHARE = [
  {key: 'food', label: '식비', value: 42, color: '#1CD66C'},
  {key: 'home', label: '주거', value: 31, color: '#3D8BFF'},
  {key: 'move', label: '교통', value: 15, color: '#A351F4'},
  {key: 'etc', label: '기타', value: 12, color: '#E2B101'},
];

const TREND = [
  {key: '06', label: '6월', value: 1120000},
  {key: '07', label: '7월', value: 980000},
  {key: '08', label: '8월', value: 1310000},
  {key: '09', label: '9월', value: 1040000},
  {key: '10', label: '10월', value: 1190000},
  {key: '11', label: '11월', value: 1284000},
];

const won = (value: number): string => `₩${value.toLocaleString('ko-KR')}`;

function Board(): React.ReactElement {
  const {theme} = useTheme();
  const [day, setDay] = useState('2026-11-02');
  const [month, setMonth] = useState('11');
  const selected = TREND.find((point) => point.key === month) ?? TREND[5]!;

  return (
    <View style={[styles.board, {backgroundColor: theme.role.accent}]}>
      <View style={[styles.panel, {backgroundColor: theme.bg.basic}]}>
        <Calendar
          locale="ko-KR"
          markers={MARKERS}
          onChange={(_, key) => setDay(key)}
          paging="none"
          selectionAnimation
          size="compact"
          today={TODAY}
          value={day}
          weekStart={0}
        />
      </View>
      <View style={styles.column}>
        <View
          style={[
            styles.panel,
            styles.split,
            {backgroundColor: theme.bg.basic},
          ]}
        >
          <DonutChart
            accessibilityLabel={`11월 지출 ${won(1284000)}, 식비 42%, 주거 31%, 교통 15%, 기타 12%`}
            data={SHARE}
            innerRadiusRatio={0.74}
            size={132}
          >
            <Typography.Body4 style={{color: theme.text.label}}>
              11월 지출
            </Typography.Body4>
            <Typography.Body2 style={styles.total}>
              {won(1284000)}
            </Typography.Body2>
          </DonutChart>
          <View style={styles.actions}>
            <Button
              startElement={<Icon name="Plus" />}
              onPress={() => setDay('2026-11-02')}
              text="내역 추가"
              type="solid"
            />
            <Button
              onPress={() => setMonth('11')}
              text="함께 보기"
              type="outlined"
            />
          </View>
        </View>
        <View style={[styles.panel, {backgroundColor: theme.bg.basic}]}>
          <Typography.Body4 style={{color: theme.text.label}}>
            {`${selected.label} 지출 ${won(selected.value)}`}
          </Typography.Body4>
          <LineChart
            accessibilityLabel="최근 6개월 지출"
            data={TREND}
            formatValue={won}
            onSelect={(datum) => setMonth(datum.key)}
            selectedKey={month}
            variant="compact"
          />
        </View>
      </View>
    </View>
  );
}

const meta = {
  title: 'Overview/Specimen',
  component: Board,
  // No story frame: the board aligns with the docs text column.
  decorators: [
    (Story, context) => (
      <CpkProvider
        key={context.globals.theme}
        themeConfig={{
          initialThemeType: context.globals.theme === 'dark' ? 'dark' : 'light',
        }}
      >
        <Story />
      </CpkProvider>
    ),
  ],
  tags: ['!dev', '!autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof Board>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ledger: Story = {};

const styles = StyleSheet.create({
  actions: {gap: 8},
  board: {
    alignItems: 'flex-start',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  column: {flexBasis: 280, flexGrow: 1, flexShrink: 1, gap: 12, minWidth: 0},
  panel: {
    borderRadius: 16,
    flexBasis: 280,
    flexShrink: 1,
    minWidth: 0,
    flexGrow: 1,
    padding: 16,
  },
  split: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
  },
  total: {fontWeight: '700'},
});
