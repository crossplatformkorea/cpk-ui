import React, {type ReactElement} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useReducedMotion} from 'react-native-reanimated';
import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render} from '@testing-library/react-native';

import {createComponent, createTestProps} from '../../../../test/testUtils';
import {Accordion} from './Accordion';

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  useReducedMotion: jest.fn(() => false),
}));

describe('[Accordion] controlled custom header', () => {
  const datum = [{title: 'Meal', items: ['Edit']}];
  it('keeps independent controls and only changes disclosure through the owner', () => {
    const changed = jest.fn();
    const edited = jest.fn();
    const header = ({
      expanded,
      toggle,
    }: {
      expanded: boolean;
      toggle: () => void;
    }) => (
      <View>
        <Pressable onPress={edited} testID="edit">
          <Text>Edit icon</Text>
        </Pressable>
        <Pressable
          accessibilityState={{expanded}}
          onPress={toggle}
          testID="more"
        >
          <Text>More</Text>
        </Pressable>
      </View>
    );
    const screen = render(
      createComponent(
        <Accordion
          data={datum}
          expandedIndexes={[]}
          onExpandedChange={changed}
          renderHeader={header}
        />,
      ),
    );
    fireEvent.press(screen.getByTestId('edit'));
    expect(edited).toHaveBeenCalledTimes(1);
    expect(changed).not.toHaveBeenCalled();
    fireEvent.press(screen.getByTestId('more'));
    expect(changed).toHaveBeenLastCalledWith(0, true);
    expect(
      screen.getByTestId('body-0', {includeHiddenElements: true}).props
        .pointerEvents,
    ).toBe('none');
    screen.rerender(
      createComponent(
        <Accordion
          data={datum}
          expandedIndexes={[0]}
          onExpandedChange={changed}
          renderHeader={header}
        />,
      ),
    );
    expect(screen.getAllByText('Edit')).toHaveLength(1);
    fireEvent.press(screen.getByTestId('more'));
    expect(changed).toHaveBeenLastCalledWith(0, false);
    screen.rerender(
      createComponent(
        <Accordion
          data={datum}
          expandedIndexes={[]}
          onExpandedChange={changed}
          renderHeader={header}
        />,
      ),
    );
    expect(screen.queryByText('Edit')).toBeNull();
    expect(screen.queryByText('Edit', {includeHiddenElements: true})).toBeNull();
  });
  it('disables motion for the system preference and explicit opt-out', () => {
    jest.mocked(useReducedMotion).mockReturnValue(true);
    const screen = render(createComponent(<Accordion data={datum} />));
    const body = screen.getByTestId('body-0', {includeHiddenElements: true});
    expect(StyleSheet.flatten(body.props.style).transitionDuration).toBe(0);
    jest.mocked(useReducedMotion).mockReturnValue(false);
    screen.rerender(
      createComponent(<Accordion data={datum} shouldAnimate={false} />),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId('body-0', {includeHiddenElements: true}).props.style,
      ).transitionDuration,
    ).toBe(0);
  });
});

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

  it('keeps one body tree and lets native layout determine expanded height', () => {
    const {getByTestId} = testingLib;
    const body = getByTestId('body-0', {includeHiddenElements: true});
    expect(StyleSheet.flatten(body.props.style).height).toBe(0);
    expect(
      testingLib.queryByTestId('measure-body-0', {includeHiddenElements: true}),
    ).toBeNull();
    fireEvent.press(getByTestId('title-0'));
    expect(
      StyleSheet.flatten(getByTestId('body-0').props.style).height,
    ).toBeUndefined();
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
