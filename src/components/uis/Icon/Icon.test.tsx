import React, {type ReactElement} from 'react';
import type {RenderAPI} from '@testing-library/react-native';
import {render} from '@testing-library/react-native';
import {createComponent} from '../../../../test/testUtils';
import {Icon} from './Icon';

let testingLib: RenderAPI;

const Component = (): ReactElement => createComponent(<Icon name="Person" />);

describe('[Icon]', () => {
  it('should render without crashing', () => {
    testingLib = render(Component());

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  describe('sizes', () => {
    it('should render with small size preset', () => {
      testingLib = render(createComponent(<Icon name="Person" size="small" />));

      const json = testingLib.toJSON();
      expect(json).toBeTruthy();
    });

    it('should render with medium size preset', () => {
      testingLib = render(createComponent(<Icon name="Person" size="medium" />));

      const json = testingLib.toJSON();
      expect(json).toBeTruthy();
    });

    it('should render with large size preset', () => {
      testingLib = render(createComponent(<Icon name="Person" size="large" />));

      const json = testingLib.toJSON();
      expect(json).toBeTruthy();
    });

    it('should render with custom numeric size', () => {
      testingLib = render(createComponent(<Icon name="Person" size={32} />));

      const json = testingLib.toJSON();
      expect(json).toBeTruthy();
    });
  });
});
