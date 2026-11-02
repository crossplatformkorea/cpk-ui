import {useEffect, useState} from 'react';
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
import {TimePicker, type TimePickerProps} from './TimePicker';

const EVENING = new Date(2026, 10, 2, 21, 5);

const meta = {
  title: 'Inputs/TimePicker',
  component: TimePicker,
  parameters: {
    docs: {
      description: {
        component:
          'Hour and minute fields that write a time the way the given locale does: its hour cycle, separator, segment order and day period words come from Intl.DateTimeFormat, not from the device language. Typing commits every digit that forms a valid time; the date part of the value is kept.',
      },
    },
  },
  args: {
    value: EVENING,
    locale: 'ko',
    disabled: false,
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['ko', 'en-US', 'ja', 'zh-CN', 'id', 'de'],
      description: 'BCP-47 tag that decides the clock layout and words',
    },
    hourCycle: {
      control: 'radio',
      options: [undefined, 'h12', 'h23'],
      description: "Overrides the locale's hour cycle",
    },
    disabled: {
      control: 'boolean',
      description: 'Keeps the time visible but not editable',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof TimePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledPicker(props: TimePickerProps) {
  const [value, setValue] = useState(props.value);

  useEffect(() => setValue(props.value), [props.value]);

  return (
    <StoryStack>
      <TimePicker {...props} onChange={setValue} value={value} />
      <StoryText>
        Value: {value.toLocaleString(props.locale, {timeStyle: 'short'})}
      </StoryText>
    </StoryStack>
  );
}

export const Basic: Story = {
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="Type into either field or pick the day period. Switch the locale control to compare clocks."
        title="Entry time"
      />
      <StorySection label="Time">
        <ControlledPicker {...args} />
      </StorySection>
    </StoryCanvas>
  ),
};

export const Locales: Story = {
  args: {},
  render: () => (
    <StoryCanvas>
      <StoryHeader
        description="The same 21:05 in six locales: Korean puts the day period first and English last, while Japanese, Chinese, Indonesian and German use a 24-hour clock, Indonesian with a dot."
        title="Locale clocks"
      />
      <StoryGrid>
        {(['ko', 'en-US', 'ja', 'zh-CN', 'id', 'de'] as const).map((locale) => (
          <StorySpecimen key={locale} label={locale}>
            <ControlledPicker locale={locale} value={EVENING} />
          </StorySpecimen>
        ))}
      </StoryGrid>
    </StoryCanvas>
  ),
};

export const HourCycleOverride: Story = {
  args: {},
  render: () => (
    <StoryCanvas>
      <StoryHeader
        description="An explicit hour cycle keeps the locale's words and separator."
        title="Hour cycle"
      />
      <StoryGrid>
        <StorySpecimen label="ja · h12">
          <ControlledPicker hourCycle="h12" locale="ja" value={EVENING} />
        </StorySpecimen>
        <StorySpecimen label="en-US · h23">
          <ControlledPicker hourCycle="h23" locale="en-US" value={EVENING} />
        </StorySpecimen>
      </StoryGrid>
    </StoryCanvas>
  ),
};

export const Disabled: Story = {
  args: {disabled: true, locale: 'en-US'},
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="Use disabled when the time cannot change; the value stays readable."
        title="Locked time"
      />
      <StorySection label="Time">
        <ControlledPicker {...args} />
      </StorySection>
    </StoryCanvas>
  ),
};
