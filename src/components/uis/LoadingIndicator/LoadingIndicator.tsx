import React, {useMemo, useCallback, type ReactElement} from "react";
import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from "react-native";
import { ActivityIndicator, Image, View } from "react-native";
import {styled} from "kstyled";
import { useTheme } from "../../../providers/ThemeProvider";
import type {BaseComponentProps} from "../../../types/common";

type Styles = {
  activityIndicator?: ViewStyle;
  image?: ImageStyle;
};

export type LoadingIndicatorSizeType = 'small' | 'medium' | 'large' | number;

export interface LoadingIndicatorProps extends BaseComponentProps {
  style?: StyleProp<ViewStyle>;
  styles?: Styles;
  color?: string;
  size?: LoadingIndicatorSizeType;
  imgSource?: string | ImageSourcePropType;
  customElement?: ReactElement | (() => ReactElement);
}

const Container = styled(View)`
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
}: LoadingIndicatorProps): ReactElement {
  const { theme } = useTheme();

  // Convert size to ActivityIndicator compatible format
  const activityIndicatorSize: 'small' | 'large' | number = useMemo(() => {
    if (typeof size === 'number') return size;
    if (size === 'medium') return 'large';
    return size;
  }, [size]);

  // Memoize image source processing
  const imageSource = useMemo((): ImageSourcePropType | undefined => {
    if (!imgSource) return undefined;

    if (typeof imgSource === "string") {
      return { uri: imgSource };
    }
    return imgSource;
  }, [imgSource]);

  // Memoize image style calculation
  const imageStyle = useMemo(() => {
    if (typeof size === 'number') {
      return [{ width: size, height: size }, styles?.image];
    }
    return [
      size === "large"
        ? { width: 50, height: 50 }
        : size === "medium"
        ? { width: 40, height: 40 }
        : size === "small"
        ? { width: 30, height: 30 }
        : undefined,
      styles?.image,
    ];
  }, [size, styles?.image]);

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
        size={activityIndicatorSize}
        style={styles?.activityIndicator}
        testID={`${testID}-activity-indicator`}
      />
    );
  }, [customElement, imageSource, imageStyle, testID, activityIndicatorColor, activityIndicatorSize, styles?.activityIndicator]);

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
