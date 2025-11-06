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
  /** @deprecated Use expandOnStart instead */
  collapseOnStart?: boolean;
  /** If true, all items start expanded. Defaults to false (all items collapsed) */
  expandOnStart?: boolean;
  /** Array of indexes that should be expanded on start. Overrides expandOnStart */
  defaultExpandedIndexes?: number[];
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
  collapseOnStart,
  expandOnStart,
  defaultExpandedIndexes,
  ...rest
}: AccordionProps<T, K>): ReactElement {
  // Memoize accordion items rendering
  const accordionItems = useMemo(
    () =>
      data.map((datum, titleKey) => {
        // Determine if this item should be collapsed on start
        let shouldCollapse: boolean;

        if (
          defaultExpandedIndexes !== undefined &&
          defaultExpandedIndexes.length > 0
        ) {
          // If defaultExpandedIndexes is provided, use it
          shouldCollapse = !defaultExpandedIndexes.includes(titleKey);
        } else if (expandOnStart !== undefined) {
          // If expandOnStart is provided, use it
          shouldCollapse = !expandOnStart;
        } else if (collapseOnStart !== undefined) {
          // Fallback to deprecated collapseOnStart for backward compatibility
          shouldCollapse = collapseOnStart;
        } else {
          // Default: all items collapsed
          shouldCollapse = true;
        }

        return (
          <AccordionItem
            data={datum}
            key={titleKey}
            testID={`${titleKey}`}
            toggleElementPosition={toggleElementPosition}
            size={size}
            expandOnStart={shouldCollapse}
            {...rest}
          />
        );
      }),
    [
      data,
      toggleElementPosition,
      size,
      collapseOnStart,
      expandOnStart,
      defaultExpandedIndexes,
      rest,
    ],
  );

  return <Container style={style}>{accordionItems}</Container>;
}

// Export memoized component for better performance
export default React.memo(Accordion) as typeof Accordion;
export {Accordion};
