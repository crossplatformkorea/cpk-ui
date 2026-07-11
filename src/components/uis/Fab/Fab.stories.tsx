import React, {type ReactElement, useState} from 'react';
import {View, Text} from 'react-native';
import {styled, css} from 'kstyled';
import type {Meta, StoryObj} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {Fab} from './Fab';
import type {IconName} from '../Icon/Icon';
import type {ButtonSizeType} from '../Button/Button';

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

interface FabStoryProps {
  buttonSize?: ButtonSizeType;
}

function FabInteractiveStory(props: FabStoryProps): ReactElement {
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
        buttonSize={props.buttonSize}
      />
    </Container>
  );
}

const FAB_DOCS =
  'A persistent primary action that can reveal a short list of related actions. Keep the menu concise, place the most important action on the main button, and provide accessible labels for every icon.';

const meta = {
  title: 'Actions/Fab',
  component: FabInteractiveStory,
  parameters: {
    docs: {
      description: {
        component: FAB_DOCS,
      },
    },
  },
  argTypes: {
    buttonSize: {
      control: 'radio',
      options: ['small', 'medium', 'large', 16, 20, 24, 32],
      description:
        'Button size: "small" (8/16px), "medium" (12/24px), "large" (16/24px), or custom number for calculated padding',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof FabInteractiveStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    buttonSize: 'medium',
  },
};

export const Compact: Story = {
  args: {
    buttonSize: 'small',
  },
};
