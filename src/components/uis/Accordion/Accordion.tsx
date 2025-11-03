import React, {useMemo, type ReactElement} from 'react';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {View} from 'react-native';
import {styled} from 'kstyled';

import type {AccordionItemDataType} from './AccordionItem';
import {AccordionItem} from './AccordionItem';

const Container = styled(View)`
  flex-direction: column;
`;

type Styles = {
  container?: StyleProp<ViewStyle>;
  titleContainer?: StyleProp<ViewStyle>;
  titleText?: StyleProp<TextStyle>;
  itemContainer?: StyleProp<ViewStyle>;
  itemText?: StyleProp<TextStyle>;
  toggleElement?: StyleProp<ViewStyle>;
};

export type AccordionSizeType = 'small' | 'medium' | 'large' | number;

export type AccordionBaseProps<T = string, K = string> = {
  data: AccordionItemDataType<T, K>[];
  style?: StyleProp<ViewStyle>;
  styles?: Styles;
  size?: AccordionSizeType;
  shouldAnimate?: boolean;
  collapseOnStart?: boolean;
  animDuration?: number;
  activeOpacity?: number;
  toggleElementPosition?: 'left' | 'right';
  toggleElement?: ReactElement | null;
  renderTitle?: (title: T) => ReactElement;
  renderItem?: (body: K) => ReactElement;
  onPressItem?: (title: T | string, body: K | string) => void;
};

export type AccordionProps<T = string, K = string> = AccordionBaseProps<T, K>;

function Accordion<T, K>({
  style,
  toggleElementPosition = 'right',
  size = 'medium',
  data,
  ...rest
}: AccordionProps<T, K>): ReactElement {
  // Memoize accordion items rendering
  const accordionItems = useMemo(() =>
    data.map((datum, titleKey) => (
      <AccordionItem
        data={datum}
        key={titleKey}
        testID={`${titleKey}`}
        toggleElementPosition={toggleElementPosition}
        size={size}
        {...rest}
      />
    )),
    [data, toggleElementPosition, size, rest]
  );

  return (
    <Container style={style}>
      {accordionItems}
    </Container>
  );
}

// Export memoized component for better performance
export default React.memo(Accordion) as typeof Accordion;
export {Accordion};
