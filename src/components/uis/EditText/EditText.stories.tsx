import type {ComponentProps} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {EditText} from './EditText';

const meta = {
  title: 'EditText',
  component: (props) => <EditText {...props} />,
  argTypes: {
    required: {type: 'boolean'},
    label: {type: 'string'},
    error: {type: 'string'},
    value: {type: 'string'},
    multiline: {type: 'boolean'},
    placeholder: {type: 'string'},
    placeholderColor: {type: 'string'},
    editable: {type: 'boolean'},
    secureTextEntry: {type: 'boolean'},
    numberOfLines: {type: 'number'},
    maxLength: {type: 'number'},
    hideCounter: {type: 'boolean'},
    direction: {
      control: 'select',
      options: ['row', 'column'],
    },
    decoration: {
      control: 'select',
      options: ['underline', 'boxed'],
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof EditText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    onChangeText: () => {},
    direction: 'column',
    decoration: 'boxed',
    placeholder: 'Write something...',
    editable: true,
  },
};
