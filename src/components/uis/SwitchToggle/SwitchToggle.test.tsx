import React, {type ReactElement} from 'react';
import {Text} from 'react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import {createComponent} from '../../../../test/testUtils';
import {SwitchToggle, type SwitchToggleSizeType} from './SwitchToggle';

let testingLib: RenderAPI;

describe('[SwitchToggle]', () => {
  const handlePress = jest.fn();

  beforeEach(() => {
    handlePress.mockClear();
  });

  it('handles press event', async () => {
    testingLib = render(
      createComponent(<SwitchToggle isOn={false} onPress={handlePress} />),
    );

    const baseElement = await waitFor(() => testingLib.toJSON());
    expect(baseElement).toBeTruthy();

    const {getByRole} = testingLib;
    fireEvent.press(getByRole('switch'));
    expect(handlePress).toBeCalled();
  });

  const getSwitchToggle = ({isOn, size}: {isOn: boolean; size?: SwitchToggleSizeType}): ReactElement =>
    createComponent(
      <SwitchToggle
        isOn={isOn}
        size={size}
        offElement={<Text>off</Text>}
        onElement={<Text>on</Text>}
        onPress={handlePress}
        style={{padding: 6}}
        styles={{
          container: {paddingLeft: 6, paddingRight: 5},
          onElementContainer: {padding: 4},
          offElementContainer: {padding: 3},
          circle: {padding: 2},
          button: {padding: 1},
          circleColorOff: 'red',
          circleColorOn: 'blue',
          backgroundColorOn: 'green',
          backgroundColorOff: 'grey',
        }}
      />,
    );

  context('when switch toggle is on', () => {
    it('renders as on state', async () => {
      testingLib = render(createComponent(getSwitchToggle({isOn: true})));

      const baseElement = await waitFor(() => testingLib.toJSON());
      expect(baseElement).toBeTruthy();
    });
  });

  context('when switch toggle is off', () => {
    it('renders as off state', () => {
      const component = createComponent(getSwitchToggle({isOn: false}));
      testingLib = render(component);

      const baseElement = testingLib.toJSON();
      expect(baseElement).toBeTruthy();
    });
  });

  describe('sizes', () => {
    it('renders with small size', () => {
      const component = createComponent(getSwitchToggle({size: 'small'}));
      testingLib = render(component);

      const baseElement = testingLib.toJSON();
      expect(baseElement).toBeTruthy();
    });

    it('renders with medium size', () => {
      const component = createComponent(getSwitchToggle({size: 'medium'}));
      testingLib = render(component);

      const baseElement = testingLib.toJSON();
      expect(baseElement).toBeTruthy();
    });

    it('renders with large size', () => {
      const component = createComponent(getSwitchToggle({size: 'large'}));
      testingLib = render(component);

      const baseElement = testingLib.toJSON();
      expect(baseElement).toBeTruthy();
    });

    it('renders with custom numeric size', () => {
      const component = createComponent(getSwitchToggle({size: 28}));
      testingLib = render(component);

      const baseElement = testingLib.toJSON();
      expect(baseElement).toBeTruthy();
    });
  });
});
