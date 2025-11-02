import React, {type ReactElement, useState} from 'react';
import {View, Text} from 'react-native';
import {styled, css} from 'kstyled';
import type {Meta, StoryObj} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {Fab} from './Fab';
import type {IconName} from '../Icon/Icon';

const Container = styled(View)`
  position: relative;
  height: 500px;
  width: 100%;
`;

const InfoText = styled(Text)`
  position: absolute;
  top: 20px;
  left: 20px;
  color: ${({theme}) => theme.text.basic};
  font-size: 16px;
`;

function FabInteractiveStory(): ReactElement {
  const [isActive, setIsActive] = useState(false);
  const [lastPressed, setLastPressed] = useState<string>('');

  const handleFabPress = () => {
    const newState = !isActive;
    setIsActive(newState);
    action('FAB Toggled')({isActive: newState});
  };

  const handleItemPress = (icon?: IconName) => {
    setLastPressed(icon || '');
    setIsActive(false);
    action('FAB Item Pressed')({icon});
  };

  return (
    <Container>
      <InfoText>
        {isActive ? 'FAB is open' : 'FAB is closed'}
        {lastPressed && `\nLast pressed: ${lastPressed}`}
      </InfoText>
      <Fab
        icons={['MagnifyingGlass', 'Heart', 'Gear']}
        isActive={isActive}
        animationDuration={300}
        fabIcon="Plus"
        onPressFab={handleFabPress}
        onPressItem={handleItemPress}
      />
    </Container>
  );
}

const meta = {
  title: 'Fab',
  component: FabInteractiveStory,
  decorators: [withThemeProvider],
} satisfies Meta<typeof FabInteractiveStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
