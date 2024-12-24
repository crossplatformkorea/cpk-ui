import React from 'react';
import {View} from 'react-native';
import {ThemeProvider} from '../src/providers/ThemeProvider';
import {dark, light} from '../src/utils/colors';
import styled from '@emotion/native';
import {CpkProvider} from '../src/providers';

export const withThemeProvider = (Story: React.FC, context: any) => {
  const isDarkMode = context.globals.theme === 'dark';

  return (
    <CpkProvider
      themeConfig={{
        initialThemeType: isDarkMode ? 'dark' : 'light',
        customTheme: {
          light,
          dark,
        },
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
