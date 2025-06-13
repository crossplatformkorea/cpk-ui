// React import is needed for expo-web
import React, {useCallback, useMemo, useState} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {Pressable, View} from 'react-native';
import styled, {css} from '@emotion/native';

import type {IconName} from '../Icon/Icon';
import {Icon} from '../Icon/Icon';

const Container = styled.View`
  flex-direction: row;
`;

const StarContainer = styled.View`
  padding: 1px;

  flex-direction: row;
`;

type Styles = {
  starContainer: StyleProp<ViewStyle>;
};

export type RatingProps = {
  testID?: string;
  styles?: Styles;
  style?: StyleProp<ViewStyle>;
  size?: number;
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
  size = 24,
  iconType = 'star',
  onRatingUpdate,
  direction = 'horizontal',
  allowHalfRating = true,
  disabled = false,
  color,
}: RatingProps): React.JSX.Element {
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
        width: ${size + 'px'};
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
    }): React.JSX.Element => {
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
                size={size}
                style={{position: 'absolute'}}
              />
              <Icon
                color={color}
                name={`${iconPrefix}HalfFill` as IconName}
                size={size}
              />
            </View>
          ) : (
            <Icon
              color={color}
              name={iconName}
              size={size}
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
                width: size / 2,
                height: size,
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
                width: size / 2,
                height: size,
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
