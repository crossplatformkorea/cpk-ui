import React from 'react';
import {View} from 'react-native';
import {styled} from 'kstyled';
import {CpkProvider} from '../src/providers';
import {ThemeParam} from '../src/utils/theme';

const Container = styled(View)`
  height: 100%;
  padding: 36px;
  background-color: ${({theme}) => theme.bg.paper};
`;

export const withThemeProvider = (
  Story: React.FC,
  context: any,
  customTheme?: ThemeParam,
) => {
  // In Storybook React Native, theme is passed via context.args.theme
  // In Storybook Web, it's passed via context.globals.theme
  const themeType: 'light' | 'dark' =
    (context.args?.theme === 'dark' || context.globals?.theme === 'dark')
      ? 'dark'
      : 'light';

  return (
    <CpkProvider
      key={themeType}
      themeConfig={{
        initialThemeType: themeType,
        customTheme,
      }}
    >
      <Container>
        <Story />
      </Container>
    </CpkProvider>
  );
};
