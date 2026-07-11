import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryRow,
  StorySection,
  StoryStack,
} from '../../../../.storybook/story-ui';

import type {ButtonColorType, ButtonSizeType, ButtonType} from './Button';
import {Button} from './Button';
import type {ThemeParam} from '../../../utils/theme';
import {Icon} from '../Icon/Icon';

const buttonTypes: ButtonType[] = ['outlined', 'solid', 'text'];
const buttonSizes: ButtonSizeType[] = ['large', 'medium', 'small'];

const buttonColors: ButtonColorType[] = [
  'primary',
  'success',
  'info',
  'warning',
  'danger',
  'light',
  'secondary',
];

const customButtonTheme: ThemeParam = {
  light: {
    button: {
      primary: {bg: '#0057B8', text: '#FFFFFF'},
    },
  },
  dark: {
    button: {
      primary: {bg: '#68A7FF', text: '#08162B'},
    },
  },
};

const meta = {
  title: 'Actions/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'The primary command component. Choose solid for the main action, outlined for a secondary action, and text for low-emphasis commands. Loading preserves the button footprint; disabled removes interaction.',
      },
    },
  },
  args: {
    text: 'Create release',
    type: 'solid',
    color: 'primary',
    size: 'medium',
    onPress: action('onPress'),
  },
  argTypes: {
    type: {
      control: 'select',
      options: buttonTypes,
      description: 'Visual style of the button (solid, outlined, or text)',
    },
    color: {
      control: 'select',
      options: buttonColors,
      description: 'Color variant of the button',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 16, 20, 24, 32],
      description:
        'Button size: "small" (8/16px), "medium" (12/24px), "large" (16/24px), or custom number for calculated padding',
    },
  },
  decorators: [
    (Story, context) =>
      withThemeProvider(
        Story,
        context,
        context.parameters.customTheme as ThemeParam | undefined,
      ),
  ],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    text: 'Create release',
    type: 'solid',
    color: 'primary',
    size: 'medium',
    onPress: action('onPress'),
  },
};

export const Secondary: Story = {
  args: {
    text: 'View documentation',
    type: 'outlined',
    color: 'secondary',
    size: 'large',
    onPress: action('onPress'),
  },
};

export const Danger: Story = {
  args: {
    text: 'Delete release',
    type: 'solid',
    color: 'danger',
    size: 'small',
    onPress: action('onPress'),
  },
};

export const CustomTheme: Story = {
  args: {
    text: 'Brand action',
  },
  parameters: {
    customTheme: customButtonTheme,
    controls: {include: ['text']},
  },
};

export const VisualMatrix: Story = {
  render: () => (
    <StoryCanvas>
      <StorySection label="Variants">
        <StoryStack>
          {buttonTypes.map((type) => (
            <StoryRow key={type}>
              {buttonSizes.map((size) => (
                <Button
                  key={size}
                  onPress={action(`${type}-${size}`)}
                  size={size}
                  style={{minWidth: 132}}
                  text={`${type} ${size}`}
                  type={type}
                />
              ))}
            </StoryRow>
          ))}
        </StoryStack>
      </StorySection>
      <StorySection label="Colors">
        <StoryRow>
          {buttonColors.map((color) => (
            <Button
              color={color}
              key={color}
              onPress={action(color)}
              text={color}
            />
          ))}
        </StoryRow>
      </StorySection>
      <StorySection label="Content and states">
        <StoryRow>
          <Button
            onPress={action('leading-icon')}
            startElement={<Icon name="Plus" />}
            text="Create"
          />
          <Button
            endElement={<Icon name="ArrowRight" />}
            onPress={action('trailing-icon')}
            text="Continue"
          />
          <Button loading onPress={action('loading')} text="Saving" />
          <Button disabled onPress={action('disabled')} text="Disabled" />
          <Button
            onPress={action('custom-size')}
            size={20}
            text="Custom size"
          />
        </StoryRow>
      </StorySection>
    </StoryCanvas>
  ),
};
