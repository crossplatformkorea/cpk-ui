import type {ComponentProps} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {SwitchToggle} from './SwitchToggle';
import {withThemeProvider} from '../../../../.storybook/decorators';

const meta = {
  title: 'SwitchToggle',
  component: (props) => <SwitchToggle {...props} />,
  parameters: {
    notes: `
An animated SwitchToggle component with smooth transitions and proportional sizing.

## Features
- **Smooth Animations**: Slide and color transitions
- **Proportional Sizing**: Automatically calculates container and circle dimensions
- **Flexible Sizing**: Preset sizes and custom numeric values
- **Disabled State**: Can disable switch interaction
- **Icon Elements**: Add elements before or after the switch
- **Custom Colors**: Support for custom active and inactive colors

## Size Options
- \`small\`: 24px height, 45px width
- \`medium\`: 30px height, 56px width (default)
- \`large\`: 36px height, 67px width
- Custom number: Height = size, Width = size × 1.87, automatically calculated

## Size Calculation
When using a custom number, dimensions are calculated as:
- **Container width**: \`size × 1.87\`
- **Container height**: \`size\`
- **Circle size**: \`size × 0.67\`
- **Padding**: \`size × 0.17\`

## Usage
\`\`\`tsx
<SwitchToggle
  isOn={isToggled}
  onToggle={(value) => setIsToggled(value)}
  size="medium"
/>
\`\`\`
        `,
    docs: {
      description: {
        component: `
An animated SwitchToggle component with smooth transitions and proportional sizing.

## Features
- **Smooth Animations**: Slide and color transitions
- **Proportional Sizing**: Automatically calculates container and circle dimensions
- **Flexible Sizing**: Preset sizes and custom numeric values
- **Disabled State**: Can disable switch interaction
- **Icon Elements**: Add elements before or after the switch
- **Custom Colors**: Support for custom active and inactive colors

## Size Options
- \`small\`: 24px height, 45px width
- \`medium\`: 30px height, 56px width (default)
- \`large\`: 36px height, 67px width
- Custom number: Height = size, Width = size × 1.87, automatically calculated

## Size Calculation
When using a custom number, dimensions are calculated as:
- **Container width**: \`size × 1.87\`
- **Container height**: \`size\`
- **Circle size**: \`size × 0.67\`
- **Padding**: \`size × 0.17\`

## Usage
\`\`\`tsx
<SwitchToggle
  isOn={isToggled}
  onToggle={(value) => setIsToggled(value)}
  size="medium"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large', 24, 30, 36, 42],
      description: 'Switch size: "small" (24px), "medium" (30px), "large" (36px), or custom number with proportional scaling',
    },
    isOn: {
      description: 'Whether the switch is in the on position',
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof SwitchToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    isOn: false,
    size: 'medium',
  },
};
