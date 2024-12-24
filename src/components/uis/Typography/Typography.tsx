import React, {ReactNode} from 'react';
import {StyleProp, Text} from 'react-native';

import {CpkTheme, isEmptyObject} from '../../../utils/theme';
import {withTheme} from '../../../providers/ThemeProvider';
import {light} from '../../../utils/colors';
import {type TextStyle} from 'react-native';
import styled, {css} from '@emotion/native';

// Base Styled Component Factory
const createBaseText = (
  colorResolver: (theme: CpkTheme) => string,
  fallbackColor: string,
) => styled.Text<{theme?: CpkTheme}>`
  font-family: ${({theme}) => (theme ? 'Pretendard-Bold' : 'Pretendard')};
  color: ${({theme}) => {
    if (!theme || isEmptyObject(theme)) {
      return fallbackColor;
    }
    return colorResolver(theme);
  }};
`;

// Common Text Component Factory
const createTextComponent = (
  BaseText: ReturnType<typeof styled.Text>,
  fontSize: number,
  lineHeight: number,
) =>
  withTheme(
    ({
      style,
      children,
      theme,
      ...props
    }: {
      style?: StyleProp<TextStyle>;
      children?: ReactNode;
      theme?: CpkTheme;
    }) => (
      <BaseText
        {...props}
        theme={theme}
        style={[
          css`
            font-size: ${fontSize + 'px'};
            line-height: ${lineHeight + 'px'};
          `,
          {includeFontPadding: false},
          style,
        ]}
      >
        {children}
      </BaseText>
    ),
  );

// Standard and Inverted Base Components
const StandardBaseText = createBaseText((theme) => theme.text.basic, 'gray');
const InvertedBaseText = createBaseText(
  (theme) => theme.text.contrast,
  light.text.contrast,
);

// Standard Typography Components
const Title = createTextComponent(StandardBaseText, 36, 50.4);
const Heading1 = createTextComponent(StandardBaseText, 28, 39.2);
const Heading2 = createTextComponent(StandardBaseText, 26, 36.4);
const Heading3 = createTextComponent(StandardBaseText, 24, 33.6);
const Heading4 = createTextComponent(StandardBaseText, 22, 30.8);
const Heading5 = createTextComponent(StandardBaseText, 20, 28);
const Body1 = createTextComponent(StandardBaseText, 18, 25.2);
const Body2 = createTextComponent(StandardBaseText, 16, 22.4);
const Body3 = createTextComponent(StandardBaseText, 14, 19.6);
const Body4 = createTextComponent(StandardBaseText, 12, 16.4);

// Inverted Typography Components
const InvertedTitle = createTextComponent(InvertedBaseText, 36, 50.4);
const InvertedHeading1 = createTextComponent(InvertedBaseText, 28, 39.2);
const InvertedHeading2 = createTextComponent(InvertedBaseText, 26, 36.4);
const InvertedHeading3 = createTextComponent(InvertedBaseText, 24, 33.6);
const InvertedHeading4 = createTextComponent(InvertedBaseText, 22, 30.8);
const InvertedHeading5 = createTextComponent(InvertedBaseText, 20, 28);
const InvertedBody1 = createTextComponent(InvertedBaseText, 18, 25.2);
const InvertedBody2 = createTextComponent(InvertedBaseText, 16, 22.4);
const InvertedBody3 = createTextComponent(InvertedBaseText, 14, 19.6);
const InvertedBody4 = createTextComponent(InvertedBaseText, 12, 16.4);

export const Typography = {
  Title,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Body1,
  Body2,
  Body3,
  Body4,
};

export const TypographyInverted = {
  Title: InvertedTitle,
  Heading1: InvertedHeading1,
  Heading2: InvertedHeading2,
  Heading3: InvertedHeading3,
  Heading4: InvertedHeading4,
  Heading5: InvertedHeading5,
  Body1: InvertedBody1,
  Body2: InvertedBody2,
  Body3: InvertedBody3,
  Body4: InvertedBody4,
};

export const setFontFamily = (fontFamily: string): void => {
  const style = {
    includeFontPadding: false,
    fontFamily,
  };

  // @ts-ignore
  let oldRender = Text.render;

  // @ts-ignore
  Text.render = (...args: any) => {
    let origin = oldRender.call(this, ...args);

    return React.cloneElement(origin, {
      style: [style, origin.props.style],
    });
  };
};
