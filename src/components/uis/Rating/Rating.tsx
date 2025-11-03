// React import is needed for expo-web
import React, {useCallback, useMemo, useState, type ReactElement} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {Pressable, View} from 'react-native';
import {styled, css} from 'kstyled';

import type {IconName} from '../Icon/Icon';
import {Icon} from '../Icon/Icon';

const Container = styled(View)`
  flex-direction: row;
`;

const StarContainer = styled(View)`
  padding: 1px;

  flex-direction: row;
`;

type Styles = {
  starContainer: StyleProp<ViewStyle>;
};

export type RatingSizeType = 'small' | 'medium' | 'large' | number;

export type RatingProps = {
  testID?: string;
  styles?: Styles;
  style?: StyleProp<ViewStyle>;
  size?: RatingSizeType;
  iconType?: 'star' | 'dooboo';
  initialRating?: number;
  direction?: 'horizontal' | 'vertical';
  allowHalfRating?: boolean;
  onRatingUpdate?: (score: number) => void;
  disabled?: boolean;
  color?: string;
};

export function Rating({
  testID,
  style,
  styles,
  initialRating = 0,
  size = 'medium',
  iconType = 'star',
  onRatingUpdate,
  direction = 'horizontal',
  allowHalfRating = true,
  disabled = false,
  color,
}: RatingProps): ReactElement {
  const iconSize = typeof size === 'number'
    ? size
    : size === 'small'
      ? 18
      : size === 'large'
        ? 32
        : 24;
  const [rating, setRating] = useState(initialRating);

  const iconPrefix = useMemo(
    () => (iconType === 'star' ? 'Star' : 'QuestBox'),
    [iconType]
  );

  const containerStyles = useMemo(
    () => [
      css`
        flex-direction: ${direction === 'horizontal' ? 'row' : 'column'};
      `,
      style,
    ],
    [direction, style]
  );

  const starContainerStyles = useMemo(
    () => [
      css`
        width: ${size}px;
      `,
      styles?.starContainer,
    ],
    [size, styles?.starContainer]
  );

  const handlePress = useCallback(
    (newRating: number, halfPressed?: boolean) => {
      const convertedRating = newRating + (!halfPressed ? 0.5 : 0);

      setRating(convertedRating);

      if (onRatingUpdate) {
        onRatingUpdate(convertedRating);
      }
    },
    [onRatingUpdate]
  );

  const renderStarIcon = useCallback(
    ({
      key,
      position,
    }: {
      key: string;
      position: number;
    }): ReactElement => {
      const filled = rating >= position + (allowHalfRating ? 0.5 : 0);
      const iconName: IconName = filled ? `${iconPrefix}Fill` : `${iconPrefix}`;
      const halfFilled =
        rating >= position && rating < position + (allowHalfRating ? 0.5 : 0);

      return (
        <StarContainer
          key={key}
          style={starContainerStyles}
          testID={testID}
        >
          {halfFilled && allowHalfRating ? (
            <View style={{position: 'absolute'}}>
              <Icon
                color={color}
                name={`${iconPrefix}` as IconName}
                size={iconSize}
                style={{position: 'absolute'}}
              />
              <Icon
                color={color}
                name={`${iconPrefix}HalfFill` as IconName}
                size={iconSize}
              />
            </View>
          ) : (
            <Icon
              color={color}
              name={iconName}
              size={iconSize}
              style={{position: 'absolute'}}
            />
          )}
          <Pressable
            accessibilityRole="button"
            disabled={disabled}
            onPress={() => handlePress(position, true)}
          >
            <View
              style={{
                width: iconSize / 2,
                height: iconSize,
                backgroundColor: 'transparent',
              }}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={disabled}
            onPress={() => handlePress(position)}
          >
            <View
              style={{
                width: iconSize / 2,
                height: iconSize,
                backgroundColor: 'transparent',
              }}
            />
          </Pressable>
        </StarContainer>
      );
    },
    [
      rating,
      allowHalfRating,
      iconPrefix,
      starContainerStyles,
      testID,
      color,
      size,
      disabled,
      handlePress,
    ]
  );

  const stars = useMemo(
    () =>
      [...Array(5)].map((_, index) => {
        const position = index + (allowHalfRating ? 0.5 : 1);

        return renderStarIcon({key: `${_}-${index}`, position});
      }),
    [allowHalfRating, renderStarIcon]
  );

  return (
    <Container style={containerStyles}>
      {stars}
    </Container>
  );
}

export default React.memo(Rating) as typeof Rating;
