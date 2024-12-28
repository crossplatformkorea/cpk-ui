import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';

import type {ButtonColorType, ButtonSizeType, ButtonType} from './Button';
import {Button} from './Button';
import {ThemeParam} from '../../../utils/theme';

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

const meta = {
  title: 'Button',
  component: Button,
  args: {
    text: 'Hello world',
    type: 'solid',
    color: 'primary',
    size: 'medium',
    onPress: action('onPress'),
  },
  argTypes: {
    type: {
      control: 'select',
      options: buttonTypes,
    },
    color: {
      control: 'select',
      options: buttonColors,
    },
    size: {
      control: 'select',
      options: buttonSizes,
    },
  },
  decorators: [
    (Story, context) =>
      withThemeProvider(
        Story,
        context,
        // @ts-ignore
        context.args.theme,
      ),
  ],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    text: 'Basic Button',
    type: 'solid',
    color: 'primary',
    size: 'medium',
    onPress: action('onPress'),
  },
};

export const Secondary: Story = {
  args: {
    text: 'Secondary Button',
    type: 'outlined',
    color: 'secondary',
    size: 'large',
    onPress: action('onPress'),
  },
};

export const Danger: Story = {
  args: {
    text: 'Danger Button',
    type: 'solid',
    color: 'danger',
    size: 'small',
    onPress: action('onPress'),
  },
};

const disableAllExcept = (allowedField: string) => {
  const argTypes = {
    text: {table: {disable: true}},
    type: {table: {disable: true}},
    color: {table: {disable: true}},
    size: {table: {disable: true}},
    onPress: {table: {disable: true}},
    testID: {table: {disable: true}},
    disabled: {table: {disable: true}},
    loadingElement: {table: {disable: true}},
    borderRadius: {table: {disable: true}},
    startElement: {table: {disable: true}},
    endElement: {table: {disable: true}},
    activeOpacity: {table: {disable: true}},
    touchableHighlightProps: {table: {disable: true}},
    hitSlop: {table: {disable: true}},
    theme: {control: 'object'},
  };

  if (argTypes[allowedField]) {
    argTypes[allowedField] = {table: {disable: false}};
  }

  return argTypes;
};

export const CustomColor: Story = {
  args: {
    // @ts-ignore
    theme: {
      light: {
        button: {
          primary: {
            bg: 'red',
            text: 'white',
          },
        },
      },
      dark: {
        button: {
          primary: {
            bg: 'pink',
            text: 'red',
          },
        },
      },
    } as ThemeParam,
  },
  argTypes: disableAllExcept('theme'),
};
