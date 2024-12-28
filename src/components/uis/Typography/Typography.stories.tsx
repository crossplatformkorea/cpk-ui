import type {Meta, StoryObj} from '@storybook/react';
import {Typography} from './Typography';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {ScrollView, View} from 'react-native';
import {ThemeParam} from '../../../utils/theme';

const meta = {
  title: 'Typography',
  component: Typography.Title,
  decorators: [
    (Story, context) =>
      withThemeProvider(
        Story,
        context,
        (context.args.theme as any) || undefined,
      ),
  ],
} satisfies Meta<typeof Typography.Title>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllTypography: Story = {
  render: (args) => (
    <ScrollView contentContainerStyle={{padding: 16}}>
      {Object.entries(Typography).map(([key, Component]) => (
        <View key={key} style={{marginBottom: 16}}>
          <Component {...args}>
            {key} {args.children}
          </Component>
        </View>
      ))}
    </ScrollView>
  ),
  args: {
    children: 'Hello world',
  },
};

export const CustomTitle: Story = {
  args: {
    children: 'Custom Color',
    // @ts-ignore
    theme: {
      light: {
        text: {
          basic: 'blue',
        },
      },
      dark: {
        text: {
          basic: 'skyblue',
        },
      },
    } as ThemeParam,
  },
};
