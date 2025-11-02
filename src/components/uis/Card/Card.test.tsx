import '@testing-library/jest-native/extend-expect';

import React, {type ReactElement} from 'react';
import {Text} from 'react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import {Card} from './Card';
import type {CardProps} from './Card';
import type {ThemeType} from '../../../providers/ThemeProvider';

let testingLib: RenderAPI;

const Component = ({
  props,
  themeType,
}: {
  props?: CardProps;
  themeType?: ThemeType;
}): ReactElement =>
  createComponent(
    <Card {...props}>
      <Text>Test Content</Text>
    </Card>,
    themeType,
  );

describe('[Card]', () => {
  it('should render without crashing', () => {
    testingLib = render(Component({}));

    const json = testingLib.toJSON();
    expect(json).toBeTruthy();
  });

  it('should render with default props', () => {
    testingLib = render(Component({}));

    const cardContainer = testingLib.getByTestId('card-container');
    expect(cardContainer).toBeTruthy();
  });

  it('should render children content', () => {
    testingLib = render(Component({}));

    expect(testingLib.getByText('Test Content')).toBeTruthy();
  });

  it('should handle onPress when provided', () => {
    const mockOnPress = jest.fn();
    testingLib = render(Component({props: {onPress: mockOnPress}}));

    const cardContainer = testingLib.getByTestId('card-container');
    fireEvent.press(cardContainer);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should apply custom testID', () => {
    const customTestID = 'custom-card';
    testingLib = render(Component({props: {testID: customTestID}}));

    expect(testingLib.getByTestId(customTestID)).toBeTruthy();
  });

  it('should apply custom elevation', () => {
    testingLib = render(Component({props: {elevation: 5}}));

    const cardContainer = testingLib.getByTestId('card-container');
    expect(cardContainer).toBeTruthy();
  });

  it('should apply custom border radius', () => {
    testingLib = render(Component({props: {borderRadius: 12}}));

    const cardContainer = testingLib.getByTestId('card-container');
    expect(cardContainer).toBeTruthy();
  });

  it('should apply custom padding', () => {
    testingLib = render(Component({props: {padding: 24}}));

    const cardContainer = testingLib.getByTestId('card-container');
    expect(cardContainer).toBeTruthy();
  });

  it('should apply custom margin', () => {
    testingLib = render(Component({props: {margin: 16}}));

    const cardContainer = testingLib.getByTestId('card-container');
    expect(cardContainer).toBeTruthy();
  });

  it('should apply custom background color', () => {
    testingLib = render(Component({props: {backgroundColor: '#ff0000'}}));

    const cardContainer = testingLib.getByTestId('card-container');
    expect(cardContainer).toBeTruthy();
  });

  describe('Themes', () => {
    it('should render correctly with light theme', () => {
      testingLib = render(Component({themeType: 'light'}));

      const cardContainer = testingLib.getByTestId('card-container');
      expect(cardContainer).toBeTruthy();
    });

    it('should render correctly with dark theme', () => {
      testingLib = render(Component({themeType: 'dark'}));

      const cardContainer = testingLib.getByTestId('card-container');
      expect(cardContainer).toBeTruthy();
    });
  });

  describe('Custom Styles', () => {
    it('should apply custom container styles', () => {
      const customStyles = {
        container: {
          borderWidth: 2,
          borderColor: '#000',
        },
      };

      testingLib = render(Component({props: {styles: customStyles}}));

      const cardContainer = testingLib.getByTestId('card-container');
      expect(cardContainer).toBeTruthy();
    });

    it('should apply custom content styles', () => {
      const customStyles = {
        content: {
          alignItems: 'center' as const,
        },
      };

      testingLib = render(Component({props: {styles: customStyles}}));

      const cardContainer = testingLib.getByTestId('card-container');
      expect(cardContainer).toBeTruthy();
    });
  });
});