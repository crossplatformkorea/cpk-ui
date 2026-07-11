import React, {type ReactElement} from 'react';
import {fireEvent, render} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import type {IconName} from '../../..';
import {Fab} from './Fab';

const Component = (props): ReactElement => createComponent(<Fab {...props} />);

describe('[Fab]', () => {
  it('hides collapsed actions from interaction and accessibility', () => {
    const {getByTestId} = render(
      Component({
        icons: ['AppleLogo', 'AndroidLogo'],
        isActive: false,
        onPressFab: () => {},
      }),
    );

    const hiddenItem = getByTestId('fab-item-AppleLogo', {
      includeHiddenElements: true,
    });

    expect(hiddenItem).toHaveStyle({
      pointerEvents: 'none',
    });
    expect(hiddenItem.props.accessibilityElementsHidden).toBe(true);
    expect(hiddenItem.props['aria-hidden']).toBe(true);
    expect(
      getByTestId('AppleLogo', {includeHiddenElements: true}).props
        .accessibilityState.disabled,
    ).toBe(true);
    expect(getByTestId('fab-toggle').props.accessibilityLabel).toBe(
      'Open actions',
    );
    expect(getByTestId('fab-toggle').props.accessibilityState.expanded).toBe(
      false,
    );
  });

  it('exposes expanded actions and state', () => {
    const {getByTestId} = render(
      Component({
        icons: ['AppleLogo'],
        isActive: true,
        onPressFab: () => {},
      }),
    );

    expect(getByTestId('fab-item-AppleLogo')).toHaveStyle({
      pointerEvents: 'auto',
    });
    expect(
      getByTestId('fab-item-AppleLogo').props.accessibilityElementsHidden,
    ).toBe(false);
    expect(getByTestId('fab-item-AppleLogo').props['aria-hidden']).toBe(false);
    expect(getByTestId('AppleLogo').props.accessibilityState.disabled).toBe(
      false,
    );
    expect(getByTestId('fab-toggle').props.accessibilityLabel).toBe(
      'Close actions',
    );
    expect(getByTestId('fab-toggle').props.accessibilityState.expanded).toBe(
      true,
    );
  });

  it('should render', async () => {
    let count = 0;
    let items: IconName[] = ['AndroidLogo', 'AppleLogo'];
    // let resItem: FabItem;

    const {getByTestId} = render(
      Component({
        icons: items,
        isActive: true,
        onPressItem: () => {
          count += 1;
          // resItem = fab;
        },
        onPressFab: () => {},
      }),
    );

    expect(count).toBe(0);
    fireEvent.press(getByTestId('AndroidLogo'));
    expect(count).toBe(1);
    // expect(resItem.id).toBe(item.id);
  });

  it('should render custom Fab', async () => {
    const testingLib = render(
      Component({
        icons: ['AppleLogo', 'AndroidLogo'],
        isActive: true,
        onPressItem: () => {},
        onPressFab: () => {},
      }),
    );

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  describe('sizes', () => {
    it('should render with small size', async () => {
      const testingLib = render(
        Component({
          icons: ['AppleLogo', 'AndroidLogo'],
          size: 'small',
          isActive: true,
          onPressItem: () => {},
          onPressFab: () => {},
        }),
      );

      const json = testingLib.toJSON();
      expect(json).toBeTruthy();
    });

    it('should render with medium size', async () => {
      const testingLib = render(
        Component({
          icons: ['AppleLogo', 'AndroidLogo'],
          size: 'medium',
          isActive: true,
          onPressItem: () => {},
          onPressFab: () => {},
        }),
      );

      const json = testingLib.toJSON();
      expect(json).toBeTruthy();
    });

    it('should render with large size', async () => {
      const testingLib = render(
        Component({
          icons: ['AppleLogo', 'AndroidLogo'],
          size: 'large',
          isActive: true,
          onPressItem: () => {},
          onPressFab: () => {},
        }),
      );

      const json = testingLib.toJSON();
      expect(json).toBeTruthy();
    });

    it('should render with custom numeric size', async () => {
      const testingLib = render(
        Component({
          icons: ['AppleLogo', 'AndroidLogo'],
          size: 64,
          isActive: true,
          onPressItem: () => {},
          onPressFab: () => {},
        }),
      );

      const json = testingLib.toJSON();
      expect(json).toBeTruthy();
    });
  });
});
