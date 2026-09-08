# cpk-ui

[![npm version](https://img.shields.io/npm/v/cpk-ui.svg?style=flat-square)](https://www.npmjs.com/package/cpk-ui)
[![CI](https://github.com/crossplatformkorea/cpk-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/crossplatformkorea/cpk-ui/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/storybook-live-ff4785?style=flat-square)](https://ui.crossplatformkorea.com)
[![license](https://img.shields.io/npm/l/cpk-ui.svg?style=flat-square)](./LICENSE)

React Native components with one API across iOS, Android, and web. cpk-ui is
maintained by Cross Platform Korea and uses
[kstyled](https://crossplatformkorea.github.io/kstyled) for typed,
compile-time-aware styling.

`cpk-ui@0.8.0-beta.1` pairs with `kstyled@0.4.1`. Keep the runtime and Babel plugin on
the same kstyled version.

## Install

### Expo

```bash
npx expo install cpk-ui@0.8.0-beta.1 kstyled@0.4.1 @expo/vector-icons \
  react-native-gesture-handler react-native-svg expo-screen-orientation \
  react-native-reanimated @expo/match-media expo-haptics
bun add --dev babel-plugin-kstyled@0.4.1
```

### React Native CLI

Install Expo modules first, then add the same runtime dependencies:

```bash
npx install-expo-modules@latest
bun add cpk-ui@0.8.0-beta.1 kstyled@0.4.1 @expo/vector-icons \
  react-native-gesture-handler react-native-svg expo-screen-orientation \
  react-native-reanimated @expo/match-media expo-haptics
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

| Area             | Components                                                                       |
| ---------------- | -------------------------------------------------------------------------------- |
| Actions          | Button, CustomPressable, Fab, IconButton                                         |
| Inputs           | Calendar, Checkbox, EditText, RadioGroup, Rating, SegmentedControl, SwitchToggle |
| Feedback         | AlertDialog, ErrorBoundary, LoadingIndicator, Snackbar                           |
| Display          | Accordion, Card, Hr, Icon, ParallaxHeader, ReorderableList, Typography           |
| Media and system | PinchZoom, StatusBarBrightness                                                   |

Each public component has automated tests and Storybook coverage for its main
states. Use the [live Storybook](https://ui.crossplatformkorea.com) to inspect
controls, responsive behavior, accessibility results, and source examples.

## Release Matrix

### ReorderableList (0.8.0-beta.4)

`ReorderableList<T>` composes FlashList and react-native-drax. Provide stable
domain keys, `getItemLabel`, controlled `data`/`onReorder`, and place the
supplied `dragHandle` inside `renderItem`. Keep the host within
`GestureHandlerRootView` and give the list a bounded viewport. Apply the new
order optimistically and roll back on persistence failure. `disabled` removes
handles without hiding content. The 48pt handles also expose assistive
increment/decrement actions; no visible Move up/Move down controls are needed.
Variable row height, autoscroll and reduced motion are owned by the engine.
FlashList's default visible-item anchoring is disabled for this reorderable
surface: keeping the former first row anchored after a move would scroll the
viewport unexpectedly. Accepted orders become real row layout, not permanent
transforms, so subsequent inline editor height changes remain coherent.
The row renderer owns text semantics: compact titles may truncate, body copy
must not inherit that limit. See Display/ReorderableList stories.

Requires FlashList 2 (New Architecture), React 19 and Reanimated 4. The package
bundles its exact patched, JS-only Drax 1.1.0 dependency and MIT license. The
reproducible patch is `patches/react-native-drax@1.1.0.patch`; the build refuses
an unpatched engine. Consumers do not need a local patch, fork or postinstall
mutation. In RN 0.85+ overlays use `StyleSheet.absoluteFill` instead of removed
`absoluteFillObject`. Verify the packed engine, not only the source checkout.
The same patch late-binds SortableItem's snap callback: the container registers
it in a layout effect, so destructuring it during render captures `undefined`
and prevents the completed drop from committing. Package-boundary regression
guards cover source and module output; native drag/persistence remains required.
The patch also supports partially measured single-column virtualized lists:
hit testing uses known slots and displacement needs geometry only within the
changed range. Unknown row heights are not guessed, and grid behavior remains
unchanged. When the consumer accepts an order, flush the temporary visual
permutation into actual data and clear shifts in the layout phase. Tests cover
partial measurement, variable heights, horizontal lists and accepted order;
native reorder → expand/edit → save → reopen must still be replayed.

The 0.8.0 beta is verified with Expo 54, React Native 0.81, React 19,
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
- [0.8.0-beta.1 release notes](./docs/releases/0.8.0-beta.1.md)
- [0.8.0-beta.0 release notes](./docs/releases/0.8.0-beta.0.md)
- [0.7 engineering notes](./docs/blog/2026-07-11-cpk-ui-0.7.0.md)
- [Performance guide](./docs/PERFORMANCE.md)
- [Changelog](./CHANGELOG.md)
- [Contributing](./CONTRIBUTING.md)

### Custom dialog slots

`AlertDialog` supports the same slots in controlled props and
`useCPK().alertDialog.open(options)`: `renderHeader`, `renderBody`, and
`renderActions`. Each receives `{close}`. Render functions take precedence
over the existing `title`, `body`, and `actions` content; keep `title` as a
plain string to name the dialog for assistive technology.

```tsx
alertDialog.open({
  title: 'Transfer ownership',
  renderHeader: () => <OwnershipHeader />,
  renderBody: () => <OwnershipExplanation />,
  renderActions: ({close}) => [
    <Button key="cancel" text="Cancel" onPress={close} />,
    <Button key="confirm" text="Transfer" onPress={requestTransfer} />,
  ],
  closeOnTouchOutside: false,
});
```

The header may contain an icon or any custom content. Keep its root's height
intrinsic (not `flex: 1` inside the title slot). Custom action `style` overrides
the equal-width defaults; `flex: 0, flexBasis: 'auto'` works for intrinsic-width
actions on native and web. Use `styles.actionContainer` to align the group.
The backdrop consistently darkens either theme and respects `backdropOpacity`.

## License

MIT
