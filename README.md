# cpk-ui

React Native UI components for [Expo](https://expo.dev).

[![Npm Version](http://img.shields.io/npm/v/cpk-ui.svg?style=flat-square)](https://npmjs.org/package/cpk-ui)
[![Downloads](http://img.shields.io/npm/dm/cpk-ui.svg?style=flat-square)](https://npmjs.org/package/cpk-ui)
[![CI](https://github.com/crossplatformkorea/cpk-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/crossplatformkorea/cpk-ui/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/crossplatformkorea/cpk-ui/graph/badge.svg?token=LWZI4U369L)](https://codecov.io/gh/crossplatformkorea/cpk-ui)
[![Publish](https://github.com/crossplatformkorea/cpk-ui/actions/workflows/publish.yml/badge.svg)](https://github.com/crossplatformkorea/cpk-ui/actions/workflows/publish.yml)
[![Sponsor](https://opencollective.com/crossplatformkorea/tiers/badge.svg?style=shield)](https://opencollective.com/crossplatformkorea/tiers/badge.svg)

<img src="https://github.com/user-attachments/assets/c31ac1c2-cc0e-4f13-a542-c35045c266cd" width="320"/>

## Demo

Check out [ui.crossplatformkorea.com](https://ui.crossplatformkorea.com)

## Introduction

`cpk-ui` is a foundational design system and UI components library managed by Cross-Platform Korea. It is built using our preferred technologies, including [emotion](https://emotion.sh/docs/@emotion/native), [typescript](https://www.typescriptlang.org/), [jest](https://jestjs.io), [react-native-testing-library](https://github.com/callstack/react-native-testing-library), [expo](https://expo.io), and [storybook](https://storybook.js.org).

### Philosophy

`cpk-ui` aims to provide user-friendly, lightweight, and adaptable UI components. It emphasizes customizable `theme` variations and a responsive layout to enhance developer experience.

### Performance

`cpk-ui` is optimized for React Native performance using React's built-in optimization features:

- **React.memo**: All components are wrapped to prevent unnecessary re-renders
- **useCallback**: Event handlers are memoized for stable references
- **useMemo**: Expensive calculations and styles are memoized
- **110+ tests passing**: Comprehensive test coverage ensures reliability
- **Zero breaking changes**: All optimizations maintain API compatibility

For detailed performance information, see our [Performance Guide](docs/PERFORMANCE.md).

### Installation

#### For Expo

```sh
expo install cpk-ui @emotion/react @emotion/native @expo/vector-icons react-native-gesture-handler react-native-svg expo-screen-orientation @expo/match-media expo-haptics
```

#### For React Native CLI

```sh
# Using yarn
yarn add cpk-ui @emotion/react @emotion/native @expo/vector-icons react-native-gesture-handler react-native-svg expo-screen-orientation @expo/match-media

# Install expo modules
npx install-expo-modules@latest
```

### Usage

We focus on supporting `iOS`, `Android`, and `web` platforms, enabling [expo](https://expo.io) users to write efficient and reliable cross-platform code. For more insights into the project’s direction, refer to the [cpk-ui strategy](https://github.com/hyochan/cpk-ui/issues).

```tsx
import {CpkProvider} from 'cpk-ui';

<CpkProvider>
  <App />
</CpkProvider>;
```

## Theming

> The embedded `theme` module functionality provides the ability to create `light` and `dark` themes.

### Customizing Theme

#### 1. Define colors for `light` and `dark` theme

The `light` and `dark` theme color definitions are provided as examples above. They are objects that contain color properties for different UI components and states.

#### 2. Integrating with `CpkProvider`

When integrating with `CpkProvider`, you will provide your defined light and dark themes as the custom theme:

```tsx
<CpkProvider customTheme={{light, dark}}>
  <App />
</CpkProvider>
```

### Fonts

`cpk-ui` uses [Pretendard](https://github.com/orioncactus/pretendard) as its default font. The fonts are automatically installed with `cpk-ui`, but you must confirm they are loaded using `assetLoaded` from `useCPK`.

```tsx
import {useCPK} from 'cpk-ui';

const {assetLoaded} = useCPK();

if (!assetLoaded) {
  return <Loading />;
}

return <Main />;
```

### Icons

Integrate [Phosphoricons](https://phosphoricons.com) easily using the `Icon` component.

```tsx
import {Icon} from 'cpk-ui';

<Icon name="..." color="#AAA" size={32} />;
```

### Installing Fonts (Recommended)

`cpk-ui` uses [Pretendard](https://github.com/orioncactus/pretendard) as its default font. The font families include `Pretendard`, `Pretendard-Bold`, and `Pretendard-Thin`. From version `0.2.1`, these fonts are automatically installed when you add `cpk-ui`. However, it is important to ensure that the fonts are loaded properly using `assetLoaded` from the `CpkProvider`.

```tsx
import {useCPK} from 'cpk-ui';

const {assetLoaded} = useCPK();

if (!assetLoaded) {
  // Render loading state
  return ...;
}

return <Main/>
```

### Compatibility

|      Package       | Version  |
| :----------------: | :------: |
|       react        | >=16.13  |
|    react-native    |  >=0.58  |
|      emotion       | >=11.0.0 |
|   emotion/react    | >=11.0.0 |
|   emotion/native   | >=11.0.0 |
| @expo/vector-icons |    \*    |

### Troubleshooting

#### Resolving Issues with "cpk-ui" on Expo Web

If you encounter errors when using "cpk-ui" with expo-web, follow these steps to configure webpack:

1. **Install `@expo/webpack-config`**

```sh
yarn add @expo/webpack-config
```

2. **Configure Webpack**

Create a `webpack.config.js` file in your project root and add the following configuration:

```javascript
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['cpk-ui'],
      },
    },
    argv,
  );
  return config;
};
```

### Contributing

Read the [Contributing Guide](./CONTRIBUTING.md) before submitting pull requests. Thank you to everyone contributing to this project!
