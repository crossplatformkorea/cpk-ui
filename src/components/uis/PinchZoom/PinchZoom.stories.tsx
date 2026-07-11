import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {
  StoryCanvas,
  StoryHeader,
  StorySection,
} from '../../../../.storybook/story-ui';
import {PinchZoom} from './PinchZoom';

const meta = {
  title: 'Media/PinchZoom',
  component: PinchZoom,
  parameters: {
    docs: {
      description: {
        component:
          'Adds pinch, pan, momentum, and boundary correction to visual content. Wrap transformed content outside PinchZoom rather than passing a transform style, which would conflict with the gesture transform.',
      },
    },
  },
  argTypes: {
    fixOverflowAfterRelease: {
      control: 'boolean',
      description:
        'Automatically snap content back to bounds after gesture release',
      defaultValue: true,
    },
  },
  decorators: [withThemeProvider],
} satisfies Meta<typeof PinchZoom>;

export default meta;

type Story = StoryObj<typeof meta>;

const interactionArgs = {
  onScaleChanged: action('onScaleChanged'),
  onTranslateChanged: action('onTranslateChanged'),
  onRelease: action('onRelease'),
};

function useStageWidth(maxWidth: number) {
  const {width} = useWindowDimensions();
  return Math.min(maxWidth, Math.max(248, width - (width < 600 ? 64 : 180)));
}

function MediaPreview({
  accessibilityLabel,
  aspectRatio,
  source,
  ...pinchZoomProps
}: {
  accessibilityLabel: string;
  aspectRatio: number;
  source: ImageSourcePropType;
} & React.ComponentProps<typeof PinchZoom>) {
  const width = useStageWidth(680);
  const height = Math.round(width / aspectRatio);

  return (
    <View style={[styles.mediaFrame, {height, width}]}>
      <PinchZoom {...pinchZoomProps}>
        <Image
          accessibilityLabel={accessibilityLabel}
          accessible
          resizeMode="cover"
          source={source}
          style={{height, width}}
        />
      </PinchZoom>
    </View>
  );
}

function ArtifactPreview({
  framed = false,
  ...pinchZoomProps
}: {framed?: boolean} & React.ComponentProps<typeof PinchZoom>) {
  const size = Math.min(useStageWidth(360), 360);

  return (
    <View style={[styles.artifactFrame, {height: size, width: size}]}>
      <PinchZoom
        {...pinchZoomProps}
        style={framed ? styles.customPinchFrame : undefined}
      >
        <View style={[styles.artifact, {height: size, width: size}]}>
          <View style={styles.artifactMeta}>
            <Text style={styles.artifactEyebrow}>RELEASE ARTIFACT</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>READY</Text>
            </View>
          </View>
          <View style={styles.artifactBody}>
            <Text style={styles.artifactTitle}>cpk-ui</Text>
            <Text style={styles.artifactVersion}>0.7.0-rc.1</Text>
          </View>
          <Text style={styles.artifactFooter}>iOS · Android · Web</Text>
        </View>
      </PinchZoom>
    </View>
  );
}

export const WithImage: Story = {
  args: {
    ...interactionArgs,
    fixOverflowAfterRelease: true,
  },
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="A clipped media stage keeps transformed content inside a predictable inspection area."
        title="Cross-platform preview"
      />
      <StorySection label="Application output">
        <MediaPreview
          {...args}
          accessibilityLabel="cpk-ui running across web, iOS, and Android"
          aspectRatio={16 / 9}
          source={require('../../../../.gh-assets/all-platforms.png')}
        />
      </StorySection>
    </StoryCanvas>
  ),
};

export const WithColorBox: Story = {
  args: {
    ...interactionArgs,
    fixOverflowAfterRelease: true,
  },
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="Any React Native view can become transformable content without changing its internal layout."
        title="Release artifact"
      />
      <StorySection label="Generated package">
        <ArtifactPreview {...args} />
      </StorySection>
    </StoryCanvas>
  ),
};

export const WithoutBoundarySnap: Story = {
  args: {
    ...interactionArgs,
    fixOverflowAfterRelease: false,
  },
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="Boundary correction can be disabled when the surrounding viewer owns its own positioning rules."
        title="Free translation"
      />
      <StorySection label="Storybook integration">
        <MediaPreview
          {...args}
          accessibilityLabel="Expo application with the Storybook interface"
          aspectRatio={15 / 11}
          source={require('../../../../.gh-assets/expo-with-storybook-cli.png')}
        />
      </StorySection>
    </StoryCanvas>
  ),
};

export const WithCustomStyle: Story = {
  args: {
    ...interactionArgs,
    fixOverflowAfterRelease: true,
  },
  render: (args) => (
    <StoryCanvas>
      <StoryHeader
        description="Container styling can establish a selected or focused state without supplying a transform."
        title="Styled viewport"
      />
      <StorySection label="Focused artifact">
        <ArtifactPreview {...args} framed />
      </StorySection>
    </StoryCanvas>
  ),
};

const styles = StyleSheet.create({
  mediaFrame: {
    backgroundColor: '#EEF1F5',
    borderColor: '#CFD6E0',
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  artifactFrame: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  customPinchFrame: {
    borderColor: '#3D8BFF',
    borderRadius: 6,
    borderWidth: 3,
    overflow: 'hidden',
  },
  artifact: {
    backgroundColor: '#17191D',
    justifyContent: 'space-between',
    padding: 24,
  },
  artifactMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  artifactEyebrow: {
    color: '#9DA7B5',
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: '#153D2C',
    borderColor: '#267A54',
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: '#76D6A7',
    fontSize: 10,
    fontWeight: '700',
  },
  artifactBody: {
    gap: 6,
  },
  artifactTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
  },
  artifactVersion: {
    color: '#B7C0CC',
    fontSize: 17,
  },
  artifactFooter: {
    color: '#7F8A99',
    fontSize: 12,
  },
});
