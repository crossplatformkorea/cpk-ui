import React, {type ReactElement} from 'react';
import {View} from 'react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {render} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import {Typography, TypographyInverted} from './Typography';
import {ThemeProvider} from '../../../providers/ThemeProvider';

let testingLib: RenderAPI;

const Component = (): ReactElement =>
  createComponent(
    <View>
      <Typography.Title />,
      <Typography.Heading1 />,
      <Typography.Heading2 />,
      <Typography.Heading3 />,
      <Typography.Body1 />,
      <Typography.Body2 />,
      <TypographyInverted.Title />
      <TypographyInverted.Heading1 />
      <TypographyInverted.Heading2 />
      <TypographyInverted.Heading3 />
      <TypographyInverted.Body1 />
      <TypographyInverted.Body2 />
    </View>,
  );

describe('[Typography]', () => {
  it('should render without crashing', () => {
    testingLib = render(<Component />);

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('should render default theme', () => {
    testingLib = render(Component());

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('should render [dark] mode', () => {
    testingLib = render(
      <ThemeProvider initialThemeType="dark">
        <Component />
      </ThemeProvider>,
    );

    const json = testingLib.toJSON();

    expect(json).toBeTruthy();
  });

  it('keeps Korean words whole on iOS unless the caller overrides it', () => {
    testingLib = render(
      createComponent(
        <View>
          <Typography.Body2>복구 기간 동안 열어 다시 복원할 수 있어요.</Typography.Body2>
          <Typography.Body3 lineBreakStrategyIOS="none">override</Typography.Body3>
        </View>,
      ),
    );

    expect(
      testingLib.getByText('복구 기간 동안 열어 다시 복원할 수 있어요.').props
        .lineBreakStrategyIOS,
    ).toBe('hangul-word');
    expect(testingLib.getByText('override').props.lineBreakStrategyIOS).toBe(
      'none',
    );
  });
});
