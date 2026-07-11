# cpk-ui

[![npm version](https://img.shields.io/npm/v/cpk-ui.svg?style=flat-square)](https://www.npmjs.com/package/cpk-ui)
[![CI](https://github.com/crossplatformkorea/cpk-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/crossplatformkorea/cpk-ui/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/storybook-live-ff4785?style=flat-square)](https://ui.crossplatformkorea.com)
[![license](https://img.shields.io/npm/l/cpk-ui.svg?style=flat-square)](./LICENSE)

React Native components with one API across iOS, Android, and web. cpk-ui is
maintained by Cross Platform Korea and uses
[kstyled](https://crossplatformkorea.github.io/kstyled) for typed,
compile-time-aware styling.

`cpk-ui@0.7.0` pairs with `kstyled@0.4.1`. Keep the runtime and Babel plugin on
the same kstyled version.

## Install

### Expo

```bash
npx expo install cpk-ui@0.7.0 kstyled@0.4.1 @expo/vector-icons \
  react-native-gesture-handler react-native-svg expo-screen-orientation \
  @expo/match-media expo-haptics
bun add --dev babel-plugin-kstyled@0.4.1
```

### React Native CLI

Install Expo modules first, then add the same runtime dependencies:

```bash
npx install-expo-modules@latest
bun add cpk-ui@0.7.0 kstyled@0.4.1 @expo/vector-icons \
  react-native-gesture-handler react-native-svg expo-screen-orientation \
  @expo/match-media expo-haptics
bun add --dev babel-plugin-kstyled@0.4.1
```

Configure kstyled before plugins that must run last:

```js title="babel.config.js"
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['babel-plugin-kstyled', {strict: true}],
    'react-native-reanimated/plugin',
  ],
};
```

## Provider

Wrap the application once near the root:

```tsx
import {CpkProvider, useCPK} from 'cpk-ui';

export function Root() {
  return (
    <CpkProvider>
      <App />
    </CpkProvider>
  );
}

function App() {
  const {assetLoaded} = useCPK();

  if (!assetLoaded) return null;
  return <Main />;
}
```

`CpkProvider` loads the bundled Pretendard font families and supplies light or
dark theme tokens. Applications that provide product-specific tokens can pass
`customTheme={{light, dark}}`.

## Component Surface

| Area             | Components                                                             |
| ---------------- | ---------------------------------------------------------------------- |
| Actions          | Button, CustomPressable, Fab, IconButton                               |
| Inputs           | Checkbox, EditText, RadioGroup, Rating, SegmentedControl, SwitchToggle |
| Feedback         | AlertDialog, ErrorBoundary, LoadingIndicator, Snackbar                 |
| Display          | Accordion, Card, Hr, Icon, Typography                                  |
| Media and system | PinchZoom, StatusBarBrightness                                         |

Each public component has automated tests and Storybook coverage for its main
states. Use the [live Storybook](https://ui.crossplatformkorea.com) to inspect
controls, responsive behavior, accessibility results, and source examples.

## Release Matrix

The 0.7.0 release is verified with Expo 54, React Native 0.81, React 19,
kstyled 0.4, and React Native Web 0.21. This is the release validation matrix,
not a claim that every consumer must use those exact React or React Native
versions.

## Quality Gates

```bash
bun run test:all
bun run build
bun run e2e-smoke
bun run storybook:build
bun run pack:dry
```

The npm publish guard rejects local publishing. Releases run only from the
main-branch GitHub Actions publish workflow with provenance.

## Documentation

- [Storybook](https://ui.crossplatformkorea.com)
- [0.7.0 release notes](./docs/releases/0.7.0.md)
- [0.7 engineering notes](./docs/blog/2026-07-11-cpk-ui-0.7.0.md)
- [Performance guide](./docs/PERFORMANCE.md)
- [Changelog](./CHANGELOG.md)
- [Contributing](./CONTRIBUTING.md)

## License

MIT
