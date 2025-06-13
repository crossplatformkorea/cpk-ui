import React, {useMemo, useCallback} from "react";
import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from "react-native";
import { ActivityIndicator, Image } from "react-native";
import styled from "@emotion/native";
import { useTheme } from "../../../providers/ThemeProvider";
import type {BaseComponentProps} from "../../../types/common";

type Styles = {
  activityIndicator?: ViewStyle;
  image?: ImageStyle;
};

export interface LoadingIndicatorProps extends BaseComponentProps {
  style?: StyleProp<ViewStyle>;
  styles?: Styles;
  color?: string;
  size?: ActivityIndicator["props"]["size"];
  imgSource?: string | ImageSourcePropType;
  customElement?: React.JSX.Element | (() => React.JSX.Element);
}

const Container = styled.View`
  justify-content: center;
  align-items: center;
`;

function LoadingIndicator({
  customElement,
  style,
  styles,
  size = "large",
  color,
  imgSource,
  testID,
}: LoadingIndicatorProps): React.JSX.Element {
  const { theme } = useTheme();

  // Memoize image source processing
  const imageSource = useMemo((): ImageSourcePropType | undefined => {
    if (!imgSource) return undefined;
    
    if (typeof imgSource === "string") {
      return { uri: imgSource };
    }
    return imgSource;
  }, [imgSource]);

  // Memoize image style calculation
  const imageStyle = useMemo(() => [
    size === "large"
      ? { width: 50, height: 50 }
      : size === "small"
      ? { width: 30, height: 30 }
      : undefined,
    styles?.image,
  ], [size, styles?.image]);

  // Memoize activity indicator color
  const activityIndicatorColor = useMemo(() => {
    return color || theme.role.secondary;
  }, [color, theme.role.secondary]);

  // Memoize content renderer
  const renderContent = useCallback(() => {
    if (customElement) {
      return typeof customElement === "function" ? customElement() : customElement;
    }

    if (imageSource) {
      return (
        <Image
          source={imageSource}
          style={imageStyle}
          testID={`${testID}-image`}
        />
      );
    }

    return (
      <ActivityIndicator
        color={activityIndicatorColor}
        size={size}
        style={styles?.activityIndicator}
        testID={`${testID}-activity-indicator`}
      />
    );
  }, [customElement, imageSource, imageStyle, testID, activityIndicatorColor, size, styles?.activityIndicator]);

  return (
    <Container style={style} testID={testID}>
      {renderContent()}
    </Container>
  );
}

// Export memoized component for better performance
export default React.memo(LoadingIndicator) as typeof LoadingIndicator;

// Also export the non-memoized version for cases where memoization is not needed
export {LoadingIndicator};
