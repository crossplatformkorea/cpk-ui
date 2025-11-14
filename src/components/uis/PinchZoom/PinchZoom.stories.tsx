import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Image, Text, View} from 'react-native';
import {css} from 'kstyled';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {PinchZoom} from './PinchZoom';

const meta = {
  title: 'PinchZoom',
  component: PinchZoom,
  parameters: {
    docs: {
      description: {
        component: `
A powerful PinchZoom component that enables pinch-to-zoom and pan gestures for images and content.

## Features
- **Pinch to Zoom**: Two-finger pinch gesture for zooming in/out
- **Pan Gesture**: Single-finger drag to move zoomed content
- **Momentum Scrolling**: Smooth deceleration after pan gesture release
- **Boundary Detection**: Prevents excessive panning beyond content bounds
- **Customizable Constraints**: Control overflow behavior on X and Y axes
- **Programmatic Control**: Imperative API to set scale and translation values

## Props
- \`onScaleChanged\`: Callback fired when zoom scale changes
- \`onTranslateChanged\`: Callback fired when content position changes
- \`onRelease\`: Callback fired after gesture animation completes (decay or snap-back)
- \`allowEmpty\`: When \`true\`, allows unrestricted overflow on specific axes (x/y). When \`false\` or undefined, clamps translation to content bounds
- \`fixOverflowAfterRelease\`: Auto-snap to bounds after release (default: true). When \`false\`, \`onRelease\` fires immediately without snap animation
- \`style\`: Custom view style. **Warning**: Passing \`transform\` in style will disable pinch-zoom. Use a wrapper View for custom transforms

## Usage
\`\`\`tsx
<PinchZoom
  onScaleChanged={(scale) => console.log('Scale:', scale)}
  onTranslateChanged={({x, y}) => console.log('Position:', x, y)}
  onRelease={() => console.log('Released')}
>
  <Image
    source={{uri: 'https://example.com/image.jpg'}}
    style={{width: 300, height: 300}}
  />
</PinchZoom>
\`\`\`

## Imperative API
\`\`\`tsx
const pinchZoomRef = useRef<PinchZoomRef>(null);

// Set zoom and position programmatically
pinchZoomRef.current?.setValues({
  scale: 2,
  translate: {x: 50, y: 50}
});
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    fixOverflowAfterRelease: {
      control: 'boolean',
      description: 'Automatically snap content back to bounds after gesture release',
      defaultValue: true,
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof PinchZoom>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    onScaleChanged: action('onScaleChanged'),
    onTranslateChanged: action('onTranslateChanged'),
    onRelease: action('onRelease'),
    fixOverflowAfterRelease: true,
  },
  render: (args) => (
    <View
      style={css`
        flex: 1;
        justify-content: center;
        align-items: center;
        background-color: #f5f5f5;
      `}
    >
      <PinchZoom {...args}>
        <Image
          source={{
            uri: 'https://picsum.photos/300/300',
          }}
          style={css`
            width: 300px;
            height: 300px;
            border-radius: 8px;
          `}
        />
      </PinchZoom>
    </View>
  ),
};

export const WithColorBox: Story = {
  args: {
    onScaleChanged: action('onScaleChanged'),
    onTranslateChanged: action('onTranslateChanged'),
    onRelease: action('onRelease'),
    fixOverflowAfterRelease: true,
  },
  render: (args) => (
    <View
      style={css`
        flex: 1;
        justify-content: center;
        align-items: center;
        background-color: #f5f5f5;
      `}
    >
      <PinchZoom {...args}>
        <View
          style={css`
            width: 250px;
            height: 250px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            justify-content: center;
            align-items: center;
            shadow-color: #000;
            shadow-offset: 0px 4px;
            shadow-opacity: 0.3;
            shadow-radius: 8px;
            elevation: 5;
          `}
        >
          <Text
            style={css`
              color: white;
              font-size: 24px;
              font-weight: bold;
            `}
          >
            Pinch to Zoom
          </Text>
          <Text
            style={css`
              color: rgba(255, 255, 255, 0.9);
              font-size: 14px;
              margin-top: 8px;
            `}
          >
            Try pinching and dragging!
          </Text>
        </View>
      </PinchZoom>
    </View>
  ),
};

export const WithoutBoundarySnap: Story = {
  args: {
    onScaleChanged: action('onScaleChanged'),
    onTranslateChanged: action('onTranslateChanged'),
    onRelease: action('onRelease'),
    fixOverflowAfterRelease: false,
  },
  render: (args) => (
    <View
      style={css`
        flex: 1;
        justify-content: center;
        align-items: center;
        background-color: #f5f5f5;
      `}
    >
      <PinchZoom {...args}>
        <Image
          source={{
            uri: 'https://picsum.photos/300/400',
          }}
          style={css`
            width: 300px;
            height: 400px;
            border-radius: 8px;
          `}
        />
      </PinchZoom>
      <Text
        style={css`
          position: absolute;
          bottom: 40px;
          color: #666;
          font-size: 12px;
        `}
      >
        fixOverflowAfterRelease = false
      </Text>
    </View>
  ),
};

export const WithCustomStyle: Story = {
  args: {
    onScaleChanged: action('onScaleChanged'),
    onTranslateChanged: action('onTranslateChanged'),
    onRelease: action('onRelease'),
    fixOverflowAfterRelease: true,
  },
  render: (args) => (
    <View
      style={css`
        flex: 1;
        justify-content: center;
        align-items: center;
        background-color: #1a1a1a;
      `}
    >
      <PinchZoom
        {...args}
        style={css`
          border-width: 3px;
          border-color: #667eea;
          border-radius: 12px;
          overflow: hidden;
        `}
      >
        <View
          style={css`
            width: 280px;
            height: 280px;
            background-color: #2d2d2d;
            justify-content: center;
            align-items: center;
            padding: 20px;
          `}
        >
          <Text
            style={css`
              color: #667eea;
              font-size: 20px;
              font-weight: bold;
              text-align: center;
            `}
          >
            Custom Styled
          </Text>
          <Text
            style={css`
              color: #999;
              font-size: 14px;
              text-align: center;
              margin-top: 12px;
            `}
          >
            This PinchZoom has custom border and background styles
          </Text>
        </View>
      </PinchZoom>
    </View>
  ),
};
