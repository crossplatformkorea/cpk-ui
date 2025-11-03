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
  theme?: 'light' | 'dark';
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

const FAB_DOCS = `
A Floating Action Button (FAB) component with expandable menu items.

## Features
- **Expandable Menu**: Shows multiple action buttons when activated
- **Smooth Animations**: Rotate and slide animations for FAB and items
- **Flexible Sizing**: Preset sizes and custom numeric values via buttonSize
- **Icon Support**: Uses IconButton for consistent icon rendering
- **Customizable Gap**: Control spacing between FAB items
- **Animation Duration**: Configurable animation speed

## Size Options (via buttonSize)
The FAB uses IconButton internally, so it supports ButtonSizeType:
- \`small\`: Small button size (8/16px padding)
- \`medium\`: Medium button size (12/24px padding) - default
- \`large\`: Large button size (16/24px padding)
- Custom number: Calculated padding (size * 0.6 vertical, size * 1.2 horizontal)

## Usage
\`\`\`tsx
<Fab
  icons={['MagnifyingGlass', 'Heart', 'Gear']}
  isActive={isActive}
  fabIcon="Plus"
  onPressFab={() => setIsActive(!isActive)}
  onPressItem={(icon) => console.log(icon)}
  buttonSize="medium"
  gap={12}
  animationDuration={300}
/>
\`\`\`
`;

const meta = {
  title: 'Fab',
  component: FabInteractiveStory,
  parameters: {
    notes: FAB_DOCS,
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
      description: 'Button size: "small" (8/16px), "medium" (12/24px), "large" (16/24px), or custom number for calculated padding',
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
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};
