import React from 'react';
import {useWindowDimensions, View} from 'react-native';
import {styled} from 'kstyled';
import {CpkProvider} from '../src/providers';
import {ThemeParam} from '../src/utils/theme';

const Container = styled(View)`
  flex: 1;
  align-items: center;
  background-color: ${({theme}) => theme.bg.basic};
`;

function StoryFrame({children}: {children: React.ReactNode}) {
  const {width} = useWindowDimensions();

  return (
    <Container>
      <View
        style={{
          maxWidth: 1180,
          paddingHorizontal: width < 600 ? 16 : width < 900 ? 24 : 36,
          paddingVertical: width < 600 ? 20 : 32,
          width: '100%',
        }}
      >
        {children}
      </View>
    </Container>
  );
}

export const withThemeProvider = (
  Story: React.FC,
  context: any,
  customTheme?: ThemeParam,
) => {
  // In Storybook React Native, theme is passed via context.args.theme
  // In Storybook Web, it's passed via context.globals.theme
  const themeType: 'light' | 'dark' =
    context.args?.theme === 'dark' || context.globals?.theme === 'dark'
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
      <StoryFrame>
        <Story />
      </StoryFrame>
    </CpkProvider>
  );
};
