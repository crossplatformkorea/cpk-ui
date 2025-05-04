import React from "react";
import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from "react-native";
import { ActivityIndicator, Image } from "react-native";
import styled from "@emotion/native";
import { useTheme } from "../../../providers/ThemeProvider";

type Styles = {
  activityIndicator?: ViewStyle;
  image?: ImageStyle;
};

type Props = {
  style?: StyleProp<ViewStyle>;
  styles?: Styles;
  color?: string;
  size?: ActivityIndicator["props"]["size"];
  imgSource?: string | ImageSourcePropType;
  customElement?: React.JSX.Element | (() => React.JSX.Element);
};

const Container = styled.View``;

export function LoadingIndicator({
  customElement,
  style,
  styles,
  size = "large",
  color,
  imgSource,
}: Props): React.JSX.Element {
  const { theme } = useTheme();

  const handleImgSourceType = (
    src: string | ImageSourcePropType
  ): ImageSourcePropType => {
    if (typeof src === "string") {
      return {
        uri: src,
      };
    }

    return src;
  };

  return (
    <Container style={style}>
      {customElement ? (
        typeof customElement === "function" ? (
          customElement()
        ) : (
          customElement
        )
      ) : !imgSource ? (
        <ActivityIndicator
          color={color || theme.role.secondary}
          size={size}
          style={styles?.activityIndicator}
        />
      ) : (
        <Image
          source={handleImgSourceType(imgSource)}
          style={[
            size === "large"
              ? { width: 50, height: 50 }
              : size === "small"
              ? { width: 30, height: 30 }
              : undefined,
            styles?.image,
          ]}
        />
      )}
    </Container>
  );
}
