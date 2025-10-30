/**
 * @name Card
 *
 * See the style guide: https://github.com/hyochan/style-guide/blob/main/docs/REACT.md
 */
import React from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {TouchableOpacity, View} from 'react-native';
import {styled, css} from 'kstyled';

import {useTheme} from '../../../providers/ThemeProvider';

type Styles = {
  container?: StyleProp<ViewStyle>;
  content?: StyleProp<ViewStyle>;
};

export type CardProps = {
  testID?: string;
  children?: React.ReactNode;
  elevation?: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  styles?: Styles;
  onPress?: () => void;
};

export default function Card({
  testID = 'card-container',
  children,
  elevation = 2,
  borderRadius = 8,
  padding = 16,
  margin = 0,
  backgroundColor,
  style,
  styles,
  onPress,
}: CardProps): JSX.Element {
  const {theme} = useTheme();

  const shadowStyle = React.useMemo(() => ({
    elevation: elevation,
    shadowOffset: {
      width: 0,
      height: elevation / 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: elevation,
    shadowColor: theme.text.basic,
  }), [elevation, theme.text.basic]);

  const containerStyle = React.useMemo(() => [
    {
      backgroundColor: backgroundColor || theme.bg.paper,
      borderRadius: borderRadius,
      padding: padding,
      margin: margin,
    },
    shadowStyle,
    style,
    styles?.container,
  ], [backgroundColor, theme.bg.paper, borderRadius, padding, margin, shadowStyle, style, styles?.container]);

  if (onPress) {
    return (
      <TouchableContainer
        testID={testID}
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles?.content}>
          {children}
        </View>
      </TouchableContainer>
    );
  }

  return (
    <Container testID={testID} style={containerStyle}>
      <View style={styles?.content}>
        {children}
      </View>
    </Container>
  );
}

const Container = styled.View`
  background-color: ${({theme}) => theme.bg.paper};
  border-radius: 8px;
`;

const TouchableContainer = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.bg.paper};
  border-radius: 8px;
`;

export {Card};