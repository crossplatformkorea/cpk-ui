import React, {useCallback, useMemo} from 'react';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {View} from 'react-native';
import {styled} from 'kstyled';

import type {RadioButtonProps, RadioButtonStyles} from './RadioButton';
import RadioButtonComp from './RadioButton';
import {Typography} from '../Typography/Typography';

type Styles = {
  container?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  radio?: StyleProp<ViewStyle>;
  radioStyles?: RadioButtonStyles;
};

export type RadioButtonType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light';

type Props<T> = {
  title?: string;
  data: T[];
  selectedValue: T;
  selectValue?: (item: T) => void;
  type?: RadioButtonType;
  style?: StyleProp<ViewStyle>;
  styles?: Styles;
  labels?: string[];
  radioType?: Omit<RadioButtonProps, 'type'>;
  labelPosition?: 'left' | 'right';
};

const Container = styled.View`
  flex-direction: column;
  justify-content: center;
`;

const Content = styled.View`
  flex-direction: row;
`;

function RadioGroupContainer<T>({
  title,
  data,
  selectedValue,
  selectValue,
  style,
  styles,
  type,
  labels,
  labelPosition,
  radioType,
}: Omit<Props<T>, 'selected'>): React.JSX.Element {
  // Memoize title spacer to avoid re-creating View
  const titleSpacer = useMemo(() => 
    title ? <View style={{height: 8}} /> : null,
    [title]
  );

  // Memoize radio buttons to prevent unnecessary re-renders
  const radioButtons = useMemo(() => 
    data.map((datum, i) => {
      const handlePress = () => selectValue?.(datum);
      
      return (
        <RadioButtonComp
          key={`radio-${i}`}
          testID={`radio-${i}`}
          {...radioType}
          label={labels?.[i] || ''}
          labelPosition={labelPosition}
          onPress={handlePress}
          selected={selectedValue === datum}
          style={styles?.radio}
          styles={styles?.radioStyles}
          type={type}
        />
      );
    }),
    [data, selectedValue, selectValue, labels, labelPosition, radioType, styles?.radio, styles?.radioStyles, type]
  );

  return (
    <Container style={style}>
      <Typography.Heading3 style={styles?.title}>{title}</Typography.Heading3>
      {titleSpacer}
      <Content style={styles?.container}>
        {radioButtons}
      </Content>
    </Container>
  );
}

// Export memoized component for better performance
export const RadioGroup = React.memo(RadioGroupContainer) as typeof RadioGroupContainer;

export const RadioButton = RadioButtonComp;
