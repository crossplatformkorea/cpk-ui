# Changelog

All notable changes to cpk-ui are documented here.

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
