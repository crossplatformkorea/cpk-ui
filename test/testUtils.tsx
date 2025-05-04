import "react-native";
import { ThemeType, ThemeProvider } from "../src/providers/ThemeProvider";
import React from "react";

export const createTestProps = (
  obj?: Record<string, unknown>
): Record<string, unknown> | unknown | any => ({
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
  },
  ...obj,
});

export const createComponent = (
  children: React.JSX.Element,
  themeType?: ThemeType
): React.JSX.Element => {
  return <ThemeProvider initialThemeType={themeType}>{children}</ThemeProvider>;
};
