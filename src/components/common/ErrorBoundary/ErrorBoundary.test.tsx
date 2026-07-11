import React from 'react';
import {Text} from 'react-native';
import {render} from '@testing-library/react-native';

import {ErrorBoundary} from './ErrorBoundary';

function ThrowingChild(): never {
  throw new Error('Preview failure');
}

describe('[ErrorBoundary]', () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('renders children while healthy', () => {
    const {getByText} = render(
      <ErrorBoundary>
        <Text>Healthy content</Text>
      </ErrorBoundary>,
    );

    expect(getByText('Healthy content')).toBeTruthy();
  });

  it('renders the default fallback and reports errors', () => {
    const onError = jest.fn();
    const {getByText} = render(
      <ErrorBoundary onError={onError}>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Preview failure')).toBeTruthy();
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('renders a custom fallback', () => {
    const {getByText} = render(
      <ErrorBoundary fallback={<Text>Recovery content</Text>}>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(getByText('Recovery content')).toBeTruthy();
  });
});
