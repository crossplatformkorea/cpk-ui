import React from 'react';
import type {RenderAPI} from '@testing-library/react-native';
import {render} from '@testing-library/react-native';
import {createComponent} from '../../../../test/testUtils';
import {Icon} from './Icon';

let testingLib: RenderAPI;

const Component = (): React.JSX.Element => createComponent(<Icon name="Person" />);

describe('[Icon]', () => {
  it('should render without crashing', () => {
    testingLib = render(Component());

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });
});
