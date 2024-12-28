import React from 'react';
import {View} from 'react-native';
import {ThemeProvider} from '../src/providers/ThemeProvider';
import {dark, light} from '../src/utils/colors';
import styled from '@emotion/native';
import {CpkProvider} from '../src/providers';
import {ThemeParam} from '../src/utils/theme';

export const withThemeProvider = (
  Story: React.FC,
  context: any,
  customTheme?: ThemeParam,
) => {
  const isDarkMode = context.globals.theme === 'dark';

  return (
    <CpkProvider
      themeConfig={{
        initialThemeType: isDarkMode ? 'dark' : 'light',
        customTheme,
      }}
    >
      <Container>
        <Story />
      </Container>
    </CpkProvider>
  );
};

const Container = styled.View`
  height: 100%;
  padding: 36px;
  background-color: ${({theme}) => theme.bg.paper};
`;
