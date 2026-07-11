import type {Meta, StoryObj} from '@storybook/react';
import {Typography} from './Typography';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {ScrollView, View} from 'react-native';
import type {ThemeParam} from '../../../utils/theme';

const customTypographyTheme: ThemeParam = {
  light: {text: {basic: '#0057B8'}},
  dark: {text: {basic: '#8AB8FF'}},
};

const meta = {
  title: 'Foundations/Typography',
  component: Typography.Title,
  parameters: {
    docs: {
      description: {
        component:
          'The text hierarchy shared across cpk-ui. Select a semantic variant before applying local style overrides so size, weight, and line height remain consistent across platforms.',
      },
    },
  },
  argTypes: {},
  decorators: [
    (Story, context) =>
      withThemeProvider(
        Story,
        context,
        context.parameters.customTheme as ThemeParam | undefined,
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
    children: 'Build once. Ship everywhere.',
  },
};

export const CustomTitle: Story = {
  args: {
    children: 'Theme-aware title',
  },
  parameters: {customTheme: customTypographyTheme},
};
