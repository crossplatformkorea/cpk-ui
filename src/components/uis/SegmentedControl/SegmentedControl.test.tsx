import * as React from 'react';
import {type ReactElement} from 'react';
import {View, Text} from 'react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render, waitFor} from '@testing-library/react-native';

import {createComponent, createTestProps} from '../../../../test/testUtils';
import {type SegmentedControlColorType, SegmentedControl} from './SegmentedControl';
import {Typography} from '../Typography/Typography';

let props: any;
let component: ReactElement;
let testingLib: RenderAPI;

const values = [
  {value: 'day', text: 'Day'},
  {value: 'week', text: 'Week'},
  {value: 'month', text: 'Month'},
];

describe('[SegmentedControl] render', () => {
  it('should render without crashing', async () => {
    props = createTestProps({
      selectedValue: 'day',
      onValueChange: (value: string | number) => (props.selectedValue = value),
    });

    component = createComponent(
      <View>
        <SegmentedControl
          values={values}
          onValueChange={props.onValueChange}
          selectedValue={props.selectedValue}
        />
      </View>,
    );

    testingLib = render(component);

    const baseElement = await waitFor(() => testingLib.toJSON());
    expect(baseElement).toBeTruthy();
  });

  it('should trigger `onValueChange` and change `selectedValue` props', () => {
    props = createTestProps({
      selectedValue: 'day',
      onValueChange: (value: string | number) => (props.selectedValue = value),
    });

    component = createComponent(
      <View>
        <SegmentedControl
          values={values}
          onValueChange={props.onValueChange}
          selectedValue={props.selectedValue}
        />
      </View>,
    );

    testingLib = render(component);

    const secondOption = testingLib.getByTestId('segment-1');
    expect(props.selectedValue).toEqual('day');

    fireEvent.press(secondOption);
    expect(props.selectedValue).toEqual('week');
  });

  it('should not trigger `onValueChange` when disabled', () => {
    props = createTestProps({
      selectedValue: 'day',
      onValueChange: jest.fn(),
    });

    component = createComponent(
      <View>
        <SegmentedControl
          values={values}
          disabled={true}
          onValueChange={props.onValueChange}
          selectedValue={props.selectedValue}
        />
      </View>,
    );

    testingLib = render(component);

    const secondOption = testingLib.getByTestId('segment-1');
    fireEvent.press(secondOption);

    expect(props.onValueChange).not.toHaveBeenCalled();
  });
});

describe('[SegmentedControl] colors', () => {
  const colors = [
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'light',
  ];

  it('should render all colors', async () => {
    component = createComponent(
      <View>
        {colors.map((color) => {
          return (
            <View key={color} style={{marginTop: 24}}>
              <SegmentedControl
                color={color as SegmentedControlColorType}
                values={values}
                selectedValue="day"
              />
            </View>
          );
        })}
      </View>,
    );

    testingLib = render(component);

    const baseElement = await waitFor(() => testingLib.toJSON());
    expect(baseElement).toBeTruthy();
  });
});

describe('[SegmentedControl] sizes', () => {
  it('should render with small size', async () => {
    component = createComponent(
      <SegmentedControl
        values={values}
        selectedValue="day"
        size="small"
      />,
    );

    testingLib = render(component);

    const baseElement = await waitFor(() => testingLib.toJSON());
    expect(baseElement).toBeTruthy();
  });

  it('should render with medium size', async () => {
    component = createComponent(
      <SegmentedControl
        values={values}
        selectedValue="day"
        size="medium"
      />,
    );

    testingLib = render(component);

    const baseElement = await waitFor(() => testingLib.toJSON());
    expect(baseElement).toBeTruthy();
  });

  it('should render with large size', async () => {
    component = createComponent(
      <SegmentedControl
        values={values}
        selectedValue="day"
        size="large"
      />,
    );

    testingLib = render(component);

    const baseElement = await waitFor(() => testingLib.toJSON());
    expect(baseElement).toBeTruthy();
  });

  it('should render with custom numeric size', async () => {
    component = createComponent(
      <SegmentedControl
        values={values}
        selectedValue="day"
        size={28}
      />,
    );

    testingLib = render(component);

    const baseElement = await waitFor(() => testingLib.toJSON());
    expect(baseElement).toBeTruthy();
  });
});

describe('[SegmentedControl] with different data lengths', () => {
  it('should render with 2 segments', async () => {
    const twoSegments = [
      {value: 'first', text: 'First'},
      {value: 'second', text: 'Second'},
    ];
    component = createComponent(
      <SegmentedControl
        values={twoSegments}
        selectedValue="first"
      />,
    );

    testingLib = render(component);

    const baseElement = await waitFor(() => testingLib.toJSON());
    expect(baseElement).toBeTruthy();
    expect(testingLib.getByTestId('segment-0')).toBeTruthy();
    expect(testingLib.getByTestId('segment-1')).toBeTruthy();
  });

  it('should render with 4 segments', async () => {
    const fourSegments = [
      {value: 1, text: 'One'},
      {value: 2, text: 'Two'},
      {value: 3, text: 'Three'},
      {value: 4, text: 'Four'},
    ];
    component = createComponent(
      <SegmentedControl
        values={fourSegments}
        selectedValue={1}
      />,
    );

    testingLib = render(component);

    const baseElement = await waitFor(() => testingLib.toJSON());
    expect(baseElement).toBeTruthy();
    expect(testingLib.getByTestId('segment-0')).toBeTruthy();
    expect(testingLib.getByTestId('segment-1')).toBeTruthy();
    expect(testingLib.getByTestId('segment-2')).toBeTruthy();
    expect(testingLib.getByTestId('segment-3')).toBeTruthy();
  });
});

describe('[SegmentedControl] custom borderRadius', () => {
  it('should render with custom border radius', async () => {
    component = createComponent(
      <SegmentedControl
        borderRadius={16}
        values={values}
        selectedValue="day"
      />,
    );

    testingLib = render(component);

    const baseElement = await waitFor(() => testingLib.toJSON());
    expect(baseElement).toBeTruthy();
  });
});

describe('[SegmentedControl] with ReactElement text', () => {
  it('should render with React elements as text', async () => {
    const valuesWithElements = [
      {value: 'grid', text: <View><Text>Grid</Text></View>},
      {value: 'list', text: <View><Text>List</Text></View>},
    ];

    component = createComponent(
      <SegmentedControl
        values={valuesWithElements}
        selectedValue="grid"
      />,
    );

    testingLib = render(component);

    const baseElement = await waitFor(() => testingLib.toJSON());
    expect(baseElement).toBeTruthy();
  });
});
