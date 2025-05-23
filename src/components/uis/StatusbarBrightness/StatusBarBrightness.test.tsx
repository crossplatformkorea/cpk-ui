import React from 'react';
import {View} from 'react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {render} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import StatusBarBrightness from './StatusBarBrightness';
import {ThemeProvider} from '../../../providers/ThemeProvider';

let testingLib: RenderAPI;

const Component = (): React.JSX.Element =>
  createComponent(
    <View>
      <StatusBarBrightness />
    </View>,
  );

describe('[StatusBarBrightness]', () => {
  it('should render without crashing', () => {
    testingLib = render(Component());

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('should render [dark] mode', () => {
    testingLib = render(
      <ThemeProvider initialThemeType="dark">
        <View>
          <StatusBarBrightness />
        </View>
      </ThemeProvider>,
    );

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });
});
