# Changelog

All notable changes to cpk-ui are documented here.

## Unreleased

### Fixed

- Keep leading and trailing button icons in sync with the final custom text
  colour when consumers compose nested style arrays.

## 0.8.0-beta.0 - 2026-08-26

### Added

- Add a responsive, controlled Calendar with month/week paging, O(1) marker
  lookup, locale-aware labels, keyboard and screen-reader support, fixed-week
  geometry, light/dark palettes, and native/web swipe implementations.
- Add a list-agnostic ParallaxHeader and `useParallaxHeader` controller for
  Animated ScrollView, FlatList, and FlashList consumers on native and web.
- Accept a host-resolved `yyyy-MM-dd` today key so business-timezone calendars
  do not silently fall back to the device timezone.

### Changed

- Make Reanimated an explicit published peer for components that run scroll and
  calendar motion on the UI thread.
- Make the E2E smoke runner use the repository's Bun toolchain instead of an
  undeclared global npx installation.

### Verification

- 23 Jest suites and 294 tests.
- 23 of 23 public components and 69 component stories covered.
- TypeScript package build, Storybook web build, seven-part E2E smoke, and npm
  tarball validation included in the release process.

## 0.7.0 - 2026-07-11

### Upgrade

cpk-ui 0.7.0 requires the kstyled 0.4 compiler and runtime contract. Install
all three packages together:

```bash
bun add cpk-ui@0.7.0 kstyled@0.4.1
bun add --dev babel-plugin-kstyled@0.4.1
```

Enable strict compilation and keep the kstyled plugin before Reanimated:

```js
plugins: [
  ['babel-plugin-kstyled', {strict: true}],
  'react-native-reanimated/plugin',
];
```

### Added

- Add a branded Storybook workbench with light and dark themes, responsive
  viewports, accessibility checks, source panels, and component documentation.
- Cover all 21 public components with at least two state or usage stories.
- Add automated public component and Storybook coverage gates.
- Add explicit accessibility labels to loading and floating action states.
- Add controlled, interactive examples for form and disclosure components.

### Changed

- Move the development and published peer contract to kstyled 0.4.1.
- Replace placeholder examples with product-oriented states and copy.
- Align dialogs, snackbars, segmented controls, inputs, ratings, accordions,
  and floating actions with their web and native interaction contracts.
- Standardize Storybook navigation around foundations, actions, inputs,
  feedback, display, media, and system behavior.

### Fixed

- Preserve controlled values and state changes in interactive examples.
- Improve focus, pressed, expanded, selected, disabled, and alert semantics.
- Resolve responsive overflow and dark canvas sizing in compact web viewports.
- Remove orphan Storybook chunks and stale story-context imports.

### Performance

- Generate the icon font glyph map from the typed icon list instead of loading
  the 6.4 MB IcoMoon selection file at runtime.
- Exclude `selection.json` from the npm package.
- Reduce the package dry-run from about 5.5 MB to 3.9 MB compressed and from
  13.1 MB to 6.8 MB unpacked.

### Verification

- 21 Jest suites and 252 tests.
- 21 of 21 public components and 56 component stories covered.
- 57 web stories audited at desktop and mobile widths, with key compact mobile
  and tablet states checked separately.
- 56 native stories audited on both iOS and Android with unique screenshots and
  no runtime errors.
- Static Storybook, TypeScript package build, E2E smoke test, and npm tarball
  validation included in the release process.
