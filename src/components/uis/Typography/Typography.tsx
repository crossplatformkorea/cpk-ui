import React, {ReactNode, useMemo} from 'react';
import {StyleProp, Text, TextInput, Platform} from 'react-native';
import {CpkTheme, isEmptyObject} from '../../../utils/theme';
import {light} from '../../../utils/colors';
import {type TextStyle} from 'react-native';
import {styled, css} from 'kstyled';

type FontFamilyOptions = {
  normal: string;
  thin?: string;
  bold?: string;
};

type FontFamilyConfig = {
  heading?: FontFamilyOptions;
  body?: FontFamilyOptions;
};

const createBaseText = (
  colorResolver: (theme: CpkTheme) => string,
  fallbackColor: string,
  isHeading: boolean,
) => styled(Text)<{theme?: CpkTheme; $fontWeight?: 'normal' | 'bold' | 'thin'}>`
  font-family: ${({$fontWeight}) => {
    const fontFamilies = getFontFamilies(isHeading);
    const {normal, thin = normal, bold = normal} = fontFamilies;
    switch ($fontWeight) {
      case 'bold':
        return bold;
      case 'thin':
        return thin;
      default:
        return normal;
    }
  }};
  color: ${({theme}) => {
    if (!theme || isEmptyObject(theme)) {
      return fallbackColor;
    }
    return colorResolver(theme);
  }};
`;

type TextComponentType = ReturnType<typeof createBaseText>;

const createTextComponent = ({
  BaseText,
  fontSize,
  lineHeight,
  fontWeight,
}: {
  BaseText: TextComponentType;
  fontSize: number;
  lineHeight: number;
  fontWeight?: 'normal' | 'bold' | 'thin';
}) =>
  React.memo(({
    style,
    children,
    ...props
  }: {
    style?: StyleProp<TextStyle>;
    children?: ReactNode;
  }) => {
    // Check if using custom font on Android for heading
    const isHeading = fontWeight === 'bold';
    const fontFamilies = getFontFamilies(isHeading);
    const isCustomFont = Platform.OS === 'android' && fontFamilies.normal !== 'Pretendard';

    // On Android, remove fontWeight when custom font is applied
    const effectiveFontWeight = isCustomFont ? undefined : fontWeight;

    // Memoize style calculation
    const textStyle = useMemo(() => [
      css`
        font-size: ${fontSize}px;
        line-height: ${lineHeight}px;
        ${effectiveFontWeight ? `font-weight: ${effectiveFontWeight};` : ''}
      `,
      {includeFontPadding: false},
      style,
    ], [style, effectiveFontWeight]);

    return (
      <BaseText
        {...props}
        $fontWeight={effectiveFontWeight}
        style={textStyle}
      >
        {children}
      </BaseText>
    );
  }) as unknown as TextComponentType;

const StandardHeadingBaseText = createBaseText((theme) => theme.text.basic, 'gray', true);
const StandardBodyBaseText = createBaseText((theme) => theme.text.basic, 'gray', false);
const InvertedHeadingBaseText = createBaseText(
  (theme) => theme.text.contrast,
  light.text.contrast,
  true,
);
const InvertedBodyBaseText = createBaseText(
  (theme) => theme.text.contrast,
  light.text.contrast,
  false,
);

const Title = createTextComponent({
  BaseText: StandardHeadingBaseText,
  fontSize: 36,
  lineHeight: 50.4,
  fontWeight: 'bold',
});

const Heading1 = createTextComponent({
  BaseText: StandardHeadingBaseText,
  fontSize: 28,
  lineHeight: 39.2,
  fontWeight: 'bold',
});

const Heading2 = createTextComponent({
  BaseText: StandardHeadingBaseText,
  fontSize: 26,
  lineHeight: 36.4,
  fontWeight: 'bold',
});

const Heading3 = createTextComponent({
  BaseText: StandardHeadingBaseText,
  fontSize: 24,
  lineHeight: 33.6,
  fontWeight: 'bold',
});

const Heading4 = createTextComponent({
  BaseText: StandardHeadingBaseText,
  fontSize: 22,
  lineHeight: 30.8,
  fontWeight: 'bold',
});

const Heading5 = createTextComponent({
  BaseText: StandardHeadingBaseText,
  fontSize: 20,
  lineHeight: 28,
  fontWeight: 'bold',
});

const Body1 = createTextComponent({
  BaseText: StandardBodyBaseText,
  fontSize: 18,
  lineHeight: 25.2,
});

const Body2 = createTextComponent({
  BaseText: StandardBodyBaseText,
  fontSize: 16,
  lineHeight: 22.4,
});

const Body3 = createTextComponent({
  BaseText: StandardBodyBaseText,
  fontSize: 14,
  lineHeight: 19.6,
});

const Body4 = createTextComponent({
  BaseText: StandardBodyBaseText,
  fontSize: 12,
  lineHeight: 16.4,
});

const InvertedTitle = createTextComponent({
  BaseText: InvertedHeadingBaseText,
  fontSize: 36,
  lineHeight: 50.4,
  fontWeight: 'bold',
});

const InvertedHeading1 = createTextComponent({
  BaseText: InvertedHeadingBaseText,
  fontSize: 28,
  lineHeight: 39.2,
  fontWeight: 'bold',
});

const InvertedHeading2 = createTextComponent({
  BaseText: InvertedHeadingBaseText,
  fontSize: 26,
  lineHeight: 36.4,
  fontWeight: 'bold',
});

const InvertedHeading3 = createTextComponent({
  BaseText: InvertedHeadingBaseText,
  fontSize: 24,
  lineHeight: 33.6,
  fontWeight: 'bold',
});

const InvertedHeading4 = createTextComponent({
  BaseText: InvertedHeadingBaseText,
  fontSize: 22,
  lineHeight: 30.8,
  fontWeight: 'bold',
});

const InvertedHeading5 = createTextComponent({
  BaseText: InvertedHeadingBaseText,
  fontSize: 20,
  lineHeight: 28,
  fontWeight: 'bold',
});

const InvertedBody1 = createTextComponent({
  BaseText: InvertedBodyBaseText,
  fontSize: 18,
  lineHeight: 25.2,
});

const InvertedBody2 = createTextComponent({
  BaseText: InvertedBodyBaseText,
  fontSize: 16,
  lineHeight: 22.4,
});

const InvertedBody3 = createTextComponent({
  BaseText: InvertedBodyBaseText,
  fontSize: 14,
  lineHeight: 19.6,
});

const InvertedBody4 = createTextComponent({
  BaseText: InvertedBodyBaseText,
  fontSize: 12,
  lineHeight: 16.4,
});

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

let currentFontFamilies: FontFamilyConfig = {
  heading: {
    normal: 'Pretendard',
    thin: 'Pretendard-Thin',
    bold: 'Pretendard-Bold',
  },
  body: {
    normal: 'Pretendard',
    thin: 'Pretendard-Thin',
    bold: 'Pretendard-Bold',
  },
};

export const setFontFamily = (fontFamilies: FontFamilyConfig): void => {
  if (fontFamilies.heading) {
    currentFontFamilies.heading = {
      ...currentFontFamilies.heading,
      ...fontFamilies.heading,
    };
  }

  if (fontFamilies.body) {
    currentFontFamilies.body = {
      ...currentFontFamilies.body,
      ...fontFamilies.body,
    };
  }

  // Memoize font family getter function
  const getFontFamily = (fontWeight: string | undefined, userFontFamily: string | undefined, isHeading: boolean): string => {
    // If user explicitly set fontFamily, use it (override)
    if (userFontFamily) {
      return userFontFamily;
    }

    const fontFamilies = isHeading ? currentFontFamilies.heading! : currentFontFamilies.body!;
    const {normal, thin = normal, bold = normal} = fontFamilies;

    switch (fontWeight) {
      case 'bold':
      case '700':
        return bold;
      case '100':
      case '200':
      case '300':
        return thin;
      default:
        return normal;
    }
  };

  const applyFontFamily = (Component: typeof Text | typeof TextInput) => {
    // @ts-ignore
    const oldRender = Component.render;

    // @ts-ignore
    Component.render = function (...args: any) {
      const origin = oldRender.call(this, ...args);

      // Check if style is an array or object
      let flatStyle: any = {};
      if (Array.isArray(origin.props.style)) {
        // Flatten array of styles
        origin.props.style.forEach((s: any) => {
          if (s) {
            flatStyle = {...flatStyle, ...s};
          }
        });
      } else if (origin.props.style) {
        flatStyle = origin.props.style;
      }

      const fontWeight = flatStyle?.fontWeight;
      const userFontFamily = flatStyle?.fontFamily;

      // Determine if this is a heading component (heuristic: bold fontWeight or fontSize > 18)
      const isHeading = fontWeight === 'bold' || fontWeight === '700' || (flatStyle?.fontSize && flatStyle.fontSize > 18);

      const updatedStyle = [
        {
          fontFamily: getFontFamily(fontWeight, userFontFamily, isHeading),
          includeFontPadding: false,
        },
        origin.props.style,
      ];

      return React.cloneElement(origin, {
        style: updatedStyle,
      });
    };
  };

  applyFontFamily(Text);
  applyFontFamily(TextInput);
};

// Memoize font families getter
export const getFontFamilies = (isHeading: boolean): FontFamilyOptions => {
  const fontFamilies = isHeading ? currentFontFamilies.heading : currentFontFamilies.body;
  return fontFamilies || {
    normal: 'Pretendard',
    thin: 'Pretendard-Thin',
    bold: 'Pretendard-Bold',
  };
};
