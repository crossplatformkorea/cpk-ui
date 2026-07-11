import React, {useEffect, useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StorySection,
  StoryStack,
} from '../../../../.storybook/story-ui';
import type {EditTextProps} from './EditText';
import {EditText} from './EditText';

function InteractiveEditText(props: EditTextProps) {
  const [value, setValue] = useState(props.value ?? '');

  useEffect(() => setValue(props.value ?? ''), [props.value]);

  return (
    <EditText
      {...props}
      onChangeText={(nextValue) => {
        setValue(nextValue);
        props.onChangeText?.(nextValue);
      }}
      value={value}
    />
  );
}

const EDITTEXT_DOCS =
  'A labeled text field for single-line, password, and multiline input. Keep validation messages specific, reserve the required marker for fields that block submission, and use a controlled value in product forms.';

const meta = {
  title: 'Inputs/EditText',
  component: EditText,
  parameters: {
    docs: {
      description: {
        component: EDITTEXT_DOCS,
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 14, 16, 18, 20],
      description:
        'Input size: "small" (14px), "medium" (16px), "large" (18px), or custom number in pixels',
    },
    required: {type: 'boolean', description: 'Shows required indicator'},
    label: {type: 'string', description: 'Label text for the input'},
    error: {type: 'string', description: 'Error message to display'},
    value: {type: 'string', description: 'Current input value'},
    multiline: {type: 'boolean', description: 'Enables multiline input'},
    placeholder: {type: 'string', description: 'Placeholder text'},
    placeholderColor: {type: 'string', description: 'Custom placeholder color'},
    editable: {type: 'boolean', description: 'Controls if input is editable'},
    secureTextEntry: {
      type: 'boolean',
      description: 'Hides text for password input',
    },
    numberOfLines: {
      type: 'number',
      description: 'Number of lines for multiline input',
    },
    maxLength: {type: 'number', description: 'Maximum character length'},
    hideCounter: {type: 'boolean', description: 'Hides character counter'},
    direction: {
      control: 'select',
      options: ['row', 'column'],
      description: 'Layout direction of label and input',
    },
    decoration: {
      control: 'select',
      options: ['underline', 'boxed'],
      description: 'Visual style of the input',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof EditText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => <InteractiveEditText {...args} />,
  args: {
    size: 'medium',
    onChangeText: () => {},
    direction: 'column',
    decoration: 'boxed',
    placeholder: 'Enter a release name',
    editable: true,
  },
};

export const StateMatrix: Story = {
  render: () => (
    <StoryCanvas>
      <StorySection label="Validation and availability">
        <StoryStack style={{maxWidth: 520}}>
          <InteractiveEditText
            decoration="boxed"
            label="Project name"
            placeholder="cpk-ui"
            required
          />
          <EditText
            decoration="boxed"
            error="Use at least 8 characters"
            label="Access key"
            value="short"
          />
          <EditText
            decoration="boxed"
            editable={false}
            label="Workspace"
            value="crossplatformkorea"
          />
        </StoryStack>
      </StorySection>
      <StorySection label="Decorations and content">
        <StoryStack style={{maxWidth: 520}}>
          <InteractiveEditText
            label="Package scope"
            placeholder="@crossplatformkorea"
          />
          <InteractiveEditText
            decoration="boxed"
            label="Password"
            secureTextEntry
            value="release-candidate"
          />
          <InteractiveEditText
            decoration="boxed"
            hideCounter={false}
            label="Release notes"
            maxLength={120}
            multiline
            numberOfLines={3}
            placeholder="Summarize the changes"
          />
        </StoryStack>
      </StorySection>
    </StoryCanvas>
  ),
};
