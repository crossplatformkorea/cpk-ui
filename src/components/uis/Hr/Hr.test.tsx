import React, {type ReactElement} from 'react';
import {View} from 'react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {render} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import {Hr} from './Hr';

let testingLib: RenderAPI;

const Component = (): ReactElement =>
  createComponent(
    <View>
      <Hr />
    </View>,
  );

describe('[Hr]', () => {
  it('should render without crashing', () => {
    testingLib = render(Component());

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });
});
