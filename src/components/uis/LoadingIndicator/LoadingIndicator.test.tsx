import React from 'react';
import {Text} from 'react-native';
import {render} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import {LoadingIndicator} from './LoadingIndicator';

describe('[LoadingIndicator]', () => {
  it('renders the platform activity indicator by default', () => {
    const {getByTestId} = render(
      createComponent(<LoadingIndicator testID="loader" />),
    );

    expect(getByTestId('loader-activity-indicator')).toBeTruthy();
    expect(getByTestId('loader-activity-indicator')).toHaveProp(
      'accessibilityLabel',
      'Loading',
    );
  });

  it('renders a custom element without the default spinner', () => {
    const {getByTestId, queryByTestId} = render(
      createComponent(
        <LoadingIndicator
          customElement={<Text testID="custom-loader">Loading</Text>}
          testID="loader"
        />,
      ),
    );

    expect(getByTestId('custom-loader')).toBeTruthy();
    expect(queryByTestId('loader-activity-indicator')).toBeNull();
  });

  it('renders function-based custom content', () => {
    const {getByTestId} = render(
      createComponent(
        <LoadingIndicator
          customElement={() => <Text testID="function-loader">Loading</Text>}
        />,
      ),
    );

    expect(getByTestId('function-loader')).toBeTruthy();
  });

  it('sizes an image source numerically', () => {
    const {getByTestId} = render(
      createComponent(
        <LoadingIndicator
          imgSource={{uri: 'https://example.com/loader.png'}}
          size={32}
          testID="image-loader"
        />,
      ),
    );

    expect(getByTestId('image-loader-image')).toHaveStyle({
      width: 32,
      height: 32,
    });
  });
});
