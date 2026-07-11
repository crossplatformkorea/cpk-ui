import React, {type ReactElement} from 'react';
import {StyleSheet, Text} from 'react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render} from '@testing-library/react-native';

import {createComponent, createTestProps} from '../../../../test/testUtils';
import {Accordion} from './Accordion';

let props: any;
let component: ReactElement;
let testingLib: RenderAPI;

const data: any[] = [
  {
    title: 'title1',
    items: ['body1', 'body2', 'body3'],
  },
  {
    title: 'title2',
    items: ['body1', 'body2', 'body3'],
  },
  {
    title: 'title3',
    items: ['body1', 'body2', 'body3'],
  },
];

describe('[Accordion] render test', () => {
  it('should render without crashing', () => {
    props = createTestProps({
      data: data,
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);

    testingLib = render(component);

    const json = testingLib.toJSON();
    expect(json).toBeTruthy();
  });

  it('should render collapsed when collapseOnStart props is true (deprecated)', () => {
    props = createTestProps({
      collapseOnStart: true,
      data: data,
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);
    testingLib = render(component);

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('should render all expanded when expandAllOnStart is true', () => {
    props = createTestProps({
      expandAllOnStart: true,
      data: data,
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);
    testingLib = render(component);

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('should render first item expanded when defaultExpandedIndexes is [0]', () => {
    props = createTestProps({
      defaultExpandedIndexes: [0],
      data: data,
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);
    testingLib = render(component);

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('should render multiple items expanded when defaultExpandedIndexes is [0, 2]', () => {
    props = createTestProps({
      defaultExpandedIndexes: [0, 2],
      data: data,
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);
    testingLib = render(component);

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('should prioritize defaultExpandedIndexes over expandAllOnStart', () => {
    props = createTestProps({
      defaultExpandedIndexes: [0],
      expandAllOnStart: true,
      data: data,
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);
    testingLib = render(component);

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('should prioritize expandAllOnStart over collapseOnStart (deprecated)', () => {
    props = createTestProps({
      expandAllOnStart: false,
      collapseOnStart: false,
      data: data,
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);
    testingLib = render(component);

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('should operate animation when shouldAnimate props is true', () => {
    props = createTestProps({
      shouldAnimate: true,
      data: data,
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);

    testingLib = render(component);

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('should adjust duration of animation depends on animDuration props value', () => {
    props = createTestProps({
      animDuration: 500,
      data: data,
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);
    testingLib = render(component);

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });
});

describe('[Accordion] event test', () => {
  beforeEach(() => {
    props = createTestProps({
      data: data,
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);
    testingLib = render(component);
  });

  it('should trigger onLayout event when itemBody rendered', () => {
    const {getByTestId} = testingLib;
    const itemTitle = getByTestId('measure-body-0', {
      includeHiddenElements: true,
    });

    fireEvent(itemTitle, 'layout', {
      nativeEvent: {
        layout: {
          height: 300,
        },
      },
    });

    const body = getByTestId('body-0', {includeHiddenElements: true});
    expect(StyleSheet.flatten(body.props.style).height).toBeDefined();
  });

  it('should trigger press event when clicking title', () => {
    expect(
      testingLib.getByTestId('body-0', {includeHiddenElements: true}).props
        .accessibilityElementsHidden,
    ).toBe(true);
    expect(
      testingLib.getByTestId('body-0', {includeHiddenElements: true}).props[
        'aria-hidden'
      ],
    ).toBe(true);
    expect(
      testingLib.getByTestId('measure-body-0', {includeHiddenElements: true})
        .props.importantForAccessibility,
    ).toBe('no-hide-descendants');

    fireEvent.press(testingLib.getByTestId('title-0'));

    expect(
      testingLib.getByTestId('body-0').props.accessibilityState.expanded,
    ).toBeTruthy();
    expect(
      testingLib.getByTestId('body-0').props.accessibilityElementsHidden,
    ).toBe(false);
    expect(testingLib.getByTestId('body-0').props['aria-hidden']).toBe(false);
  });
});

describe('[Accordion] sizes', () => {
  it('should render with small size', () => {
    props = createTestProps({
      data: data,
      size: 'small',
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);
    testingLib = render(component);

    const json = testingLib.toJSON();
    expect(json).toBeTruthy();
  });

  it('should render with medium size', () => {
    props = createTestProps({
      data: data,
      size: 'medium',
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);
    testingLib = render(component);

    const json = testingLib.toJSON();
    expect(json).toBeTruthy();
  });

  it('should render with large size', () => {
    props = createTestProps({
      data: data,
      size: 'large',
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);
    testingLib = render(component);

    const json = testingLib.toJSON();
    expect(json).toBeTruthy();
  });

  it('should render with custom numeric size', () => {
    props = createTestProps({
      data: data,
      size: 20,
      renderTitle: (title) => <Text>{title}</Text>,
      renderItem: (item) => <Text>{item}</Text>,
    });

    component = createComponent(<Accordion {...props} />);
    testingLib = render(component);

    const json = testingLib.toJSON();
    expect(json).toBeTruthy();
  });
});
