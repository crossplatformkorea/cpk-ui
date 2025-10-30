import React, {useMemo} from 'react';
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

export type AccordionBaseProps<T = string, K = string> = {
  data: AccordionItemDataType<T, K>[];
  style?: StyleProp<ViewStyle>;
  styles?: Styles;
  shouldAnimate?: boolean;
  collapseOnStart?: boolean;
  animDuration?: number;
  activeOpacity?: number;
  toggleElementPosition?: 'left' | 'right';
  toggleElement?: React.JSX.Element | null;
  renderTitle?: (title: T) => React.JSX.Element;
  renderItem?: (body: K) => React.JSX.Element;
  onPressItem?: (title: T | string, body: K | string) => void;
};

export type AccordionProps<T = string, K = string> = AccordionBaseProps<T, K>;

function Accordion<T, K>({
  style,
  toggleElementPosition = 'right',
  data,
  ...rest
}: AccordionProps<T, K>): React.JSX.Element {
  // Memoize accordion items rendering
  const accordionItems = useMemo(() => 
    data.map((datum, titleKey) => (
      <AccordionItem
        data={datum}
        key={titleKey}
        testID={`${titleKey}`}
        toggleElementPosition={toggleElementPosition}
        {...rest}
      />
    )),
    [data, toggleElementPosition, rest]
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
