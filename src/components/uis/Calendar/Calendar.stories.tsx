import {useMemo, useState, type ComponentProps, type ReactElement} from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryGrid,
  StoryHeader,
  StorySection,
  StorySpecimen,
  StoryStack,
  StoryText,
} from '../../../../.storybook/story-ui';
import {ThemeProvider, type ThemeType} from '../../../providers/ThemeProvider';
import {Calendar} from './Calendar';
import type {
  CalendarDateKey,
  CalendarMarkerMap,
  CalendarSizeType,
  CalendarViewMode,
} from './types';

/** Fixed so every story renders the same month regardless of when it is opened. */
const TODAY = new Date(2026, 7, 24, 12);

const LEDGER_MARKERS: CalendarMarkerMap = Object.freeze({
  '2026-08-03': Object.freeze({
    dots: Object.freeze([{key: 'expense'}]),
    badgeText: '-12,400',
    accessibilityHint: '2 entries, minus 12,400 won',
  }),
  '2026-08-11': Object.freeze({
    dots: Object.freeze([{key: 'income'}, {key: 'expense'}]),
    badgeText: '+80,000',
    accessibilityHint: '4 entries, plus 80,000 won',
  }),
  '2026-08-24': Object.freeze({
    dots: Object.freeze([{key: 'expense'}, {key: 'income'}, {key: 'other'}]),
    badgeText: '-42,000',
    accessibilityHint: '3 entries, minus 42,000 won',
  }),
  '2026-08-29': Object.freeze({
    dots: Object.freeze([{key: 'income'}]),
    accessibilityHint: '1 entry, plus 5,000 won',
  }),
});

const meta = {
  title: 'Inputs/Calendar',
  component: Calendar,
  parameters: {
    docs: {
      description: {
        component:
          'A month and week grid for picking a single day. Selection and the visible page are both controlled, decorations arrive as a map keyed by `yyyy-MM-dd` so a cell never scans a list, and all localized text comes from `Intl` so the library ships no date dependency. Memoize `markers`, `styles` and `labels` in the caller: identity stability is what keeps a selection change down to two cell renders.',
      },
    },
  },
  args: {
    today: TODAY,
    defaultMonth: '2026-08',
    weekStart: 0,
    locale: 'en-US',
    size: 'regular',
    fixedWeeks: true,
    showWeekNumbers: false,
    showOutsideDays: true,
    showDots: true,
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['compact', 'regular', 'expanded', 64],
      description: 'Preset row height or a custom numeric cell edge',
    },
    weekStart: {
      control: 'select',
      options: [0, 1, 6],
      description: 'First column of the grid. Defaults to the locale region',
    },
    locale: {
      control: 'select',
      options: ['en-US', 'ko', 'ja', 'de-DE', 'ar-EG'],
      description: 'BCP-47 tag used for every localized string',
    },
    fixedWeeks: {
      control: 'boolean',
      description: 'Always render six rows so the height never changes',
    },
    showWeekNumbers: {
      control: 'boolean',
      description: 'Adds a leading week number column',
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Render or blank out days from the neighbouring months',
    },
    showDots: {
      control: 'boolean',
      description: 'Render the marker dots under the day number',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledCalendar(
  props: ComponentProps<typeof Calendar>,
): ReactElement {
  const [selected, setSelected] = useState<CalendarDateKey | null>(
    '2026-08-24',
  );
  const [month, setMonth] = useState('2026-08');

  return (
    <StoryStack>
      <Calendar
        {...props}
        month={month}
        onChange={(_date, key) => setSelected(key)}
        onMonthChange={(_first, key) => setMonth(String(key).slice(0, 7))}
        value={selected}
      />
      <StoryText>
        Selected {selected ?? 'nothing'} in {month}
      </StoryText>
    </StoryStack>
  );
}

/** Forces one theme for its subtree so both palettes can be compared at once. */
function ThemedSpecimen({
  label,
  themeType,
}: {
  label: string;
  themeType: ThemeType;
}): ReactElement {
  return (
    <ThemeProvider initialThemeType={themeType}>
      <StorySpecimen label={label} value={themeType}>
        <View style={{width: '100%'}}>
          <Calendar
            defaultMonth="2026-08"
            defaultValue="2026-08-24"
            markers={LEDGER_MARKERS}
            paging="none"
            size="compact"
            today={TODAY}
          />
        </View>
      </StorySpecimen>
    </ThemeProvider>
  );
}

export const Basic: Story = {
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="Uncontrolled by default. Tap a day to move the selection, use the arrows or swipe to change month."
        title="Month grid"
      />
      <StorySection label="Selection">
        <Calendar {...args} defaultValue="2026-08-24" />
      </StorySection>
    </StoryCanvas>
  ),
};

export const Controlled: Story = {
  args: {},
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="The host owns both the selected day and the visible page, so the calendar can be driven from a store or a deep link."
        title="Controlled selection and page"
      />
      <StorySection label="State">
        <ControlledCalendar {...args} />
      </StorySection>
    </StoryCanvas>
  ),
};

export const WithMarkers: Story = {
  args: {},
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="Decorations arrive as a frozen map keyed by day. Dots carry no meaning on their own, so every marker also supplies an accessibility hint."
        title="Ledger decorations"
      />
      <StorySection label="Dots and badges">
        <Calendar
          {...args}
          defaultValue="2026-08-24"
          markers={LEDGER_MARKERS}
        />
      </StorySection>
    </StoryCanvas>
  ),
};

export const WeekMode: Story = {
  args: {},
  render: (args) => {
    const [mode, setMode] = useState<CalendarViewMode>('week');

    return (
      <StoryCanvas>
        <StoryHeader
          description="Week mode renders the same cells clipped to one row and pages seven days at a time."
          title="Single week"
        />
        <StorySection label="Mode">
          <Calendar
            {...args}
            defaultMonth="2026-08-24"
            defaultValue="2026-08-24"
            markers={LEDGER_MARKERS}
            mode={mode}
            onModeChange={setMode}
          />
        </StorySection>
      </StoryCanvas>
    );
  },
};

export const DisabledRanges: Story = {
  args: {},
  render: (args) => {
    const disabledDates = useMemo(
      () => ['2026-08-12', '2026-08-13', '2026-08-19'],
      [],
    );

    return (
      <StoryCanvas>
        <StoryHeader
          description="Precedence runs marker.disabled, then disabledDates, then the min and max range, then the predicate. Navigation buttons disable themselves at the boundary."
          title="Blocked days"
        />
        <StorySection label="Constraints">
          <Calendar
            {...args}
            defaultValue="2026-08-24"
            disabledDates={disabledDates}
            maxDate="2026-08-31"
            minDate="2026-08-05"
          />
        </StorySection>
      </StoryCanvas>
    );
  },
};

export const Themes: Story = {
  args: {},
  render: () => (
    <StoryCanvas>
      <StoryHeader
        description="Every surface, ring, dot and label resolves from theme tokens, so the same grid reads correctly in both palettes without a single hard coded colour. A caller supplied selected colour picks its own readable label by relative luminance."
        title="Light and dark"
      />
      <StoryGrid>
        <ThemedSpecimen label="Light palette" themeType="light" />
        <ThemedSpecimen label="Dark palette" themeType="dark" />
      </StoryGrid>
    </StoryCanvas>
  ),
};

export const Localized: Story = {
  args: {},
  render: () => (
    <StoryCanvas>
      <StoryHeader
        description="Month titles, weekday initials, day numbers and the full spoken label all come from Intl, including non Latin numbering systems."
        title="Locales"
      />
      <StorySection
        description="Korean renders the month title as 2026\ub144 8\uc6d4 and the weekday row as \uc77c \uc6d4 \ud654 \uc218 \ubaa9 \uae08 \ud1a0, with the week still starting on Sunday."
        label="ko"
      >
        <Calendar
          defaultMonth="2026-08"
          defaultValue="2026-08-24"
          locale="ko"
          markers={LEDGER_MARKERS}
          today={TODAY}
        />
      </StorySection>
      <StoryGrid>
        {(['en-US', 'ko', 'ja', 'ar-EG'] as const).map((locale) => (
          <StorySpecimen key={locale} label={locale}>
            <View style={{width: '100%'}}>
              <Calendar
                defaultMonth="2026-08"
                locale={locale}
                paging="none"
                size="compact"
                today={TODAY}
              />
            </View>
          </StorySpecimen>
        ))}
      </StoryGrid>
    </StoryCanvas>
  ),
};

export const WeekStart: Story = {
  args: {},
  render: () => (
    <StoryCanvas>
      <StoryHeader
        description="The first column follows the locale region unless weekStart overrides it. A Monday first grid also switches week numbering to ISO 8601, which is what European calendars show."
        title="Sunday first and Monday first"
      />
      <StoryGrid>
        <StorySpecimen label="Sunday first" value="weekStart 0">
          <View style={{width: '100%'}}>
            <Calendar
              defaultMonth="2026-08"
              defaultValue="2026-08-24"
              locale="en-US"
              paging="none"
              showWeekNumbers
              size="compact"
              today={TODAY}
              weekStart={0}
            />
          </View>
        </StorySpecimen>
        <StorySpecimen label="Monday first" value="weekStart 1">
          <View style={{width: '100%'}}>
            <Calendar
              defaultMonth="2026-08"
              defaultValue="2026-08-24"
              locale="de-DE"
              paging="none"
              showWeekNumbers
              size="compact"
              today={TODAY}
              weekStart={1}
            />
          </View>
        </StorySpecimen>
      </StoryGrid>
    </StoryCanvas>
  ),
};

export const Sizes: Story = {
  args: {},
  render: () => (
    <StoryCanvas>
      <StoryHeader
        description="Row height comes from the size preset. Column width is always flexible, so a rotation or a split view resize re-renders no cell."
        title="Size scale"
      />
      <StoryGrid>
        {(['compact', 'regular', 'expanded'] as CalendarSizeType[]).map(
          (size) => (
            <StorySpecimen key={String(size)} label={String(size)}>
              <View style={{width: '100%'}}>
                <Calendar
                  defaultMonth="2026-08"
                  defaultValue="2026-08-24"
                  paging="none"
                  size={size}
                  today={TODAY}
                />
              </View>
            </StorySpecimen>
          ),
        )}
      </StoryGrid>
    </StoryCanvas>
  ),
};

export const TabletLayout: Story = {
  args: {},
  render: () => (
    <StoryCanvas>
      <StoryHeader
        description="Inside a tablet width frame the expanded preset gets room to breathe and two month grids share one page, so the pager steps two months at a time. Columns stay flexible, so a rotation or a split view resize re-renders no cell."
        title="Tablet frame"
      />
      <StorySection label="1024 pt frame">
        <View style={{maxWidth: '100%', width: 1024}}>
          <Calendar
            defaultMonth="2026-08"
            defaultValue="2026-08-24"
            markers={LEDGER_MARKERS}
            monthsToShow={2}
            size="expanded"
            today={TODAY}
          />
        </View>
      </StorySection>
      <StorySection label="768 pt frame">
        <View style={{maxWidth: '100%', width: 768}}>
          <Calendar
            defaultMonth="2026-08"
            defaultValue="2026-08-24"
            markers={LEDGER_MARKERS}
            size="expanded"
            today={TODAY}
          />
        </View>
      </StorySection>
    </StoryCanvas>
  ),
};

export const CustomRenderDay: Story = {
  args: {},
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="renderDay receives everything precomputed, including the resolved palette and the cell edge, so a custom cell never formats a date itself."
        title="Custom cell"
      />
      <StorySection label="Render prop">
        <Calendar
          {...args}
          defaultValue="2026-08-24"
          markers={LEDGER_MARKERS}
          renderDay={({
            day,
            isSelected,
            isToday,
            marker,
            palette,
            cellSize,
          }) => (
            <View
              style={{
                width: cellSize * 0.8,
                height: cellSize * 0.8,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected
                  ? palette.selectedBackground
                  : marker
                    ? palette.underlay
                    : 'transparent',
                borderWidth: isToday ? 1 : 0,
                borderColor: palette.todayRing,
              }}
            >
              <StoryText>{String(day.dayOfMonth)}</StoryText>
            </View>
          )}
        />
      </StorySection>
    </StoryCanvas>
  ),
};
