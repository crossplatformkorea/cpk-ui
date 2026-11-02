# Changelog

All notable changes to cpk-ui are documented here.

## 0.8.0 - 2026-11-02

First stable 0.8 release. It promotes everything shipped in 0.8.0-beta.0
through 0.8.0-beta.7 and adds the chart and selection-motion primitives that
were still on feature branches.

### Added

- `DonutChart`: accessible SVG donut with a track, segment gaps and centred
  `children` (#24).
- `LineChart`: responsive generic line chart with a value tooltip, compact
  and regular variants and an empty state. Read-only it is one labelled
  image (a series summary by default); with `onSelect` it is a group of
  point buttons whose touch areas reach halfway to their neighbours (#24).
- `SelectionFeedback`: a reusable spring pop for deliberate selections, with an
  imperative `play()` and an `active` state. `reducedMotion` can keep an item
  still but never overrides the system Reduce Motion setting (#25).
- `Calendar` `selectionAnimation`: pop the selected day only after a changed
  press or keyboard selection; only the visible paging slot plays it.
  `renderDay` receives `contentMaxSize` so custom cells fit the measured
  column at large font scales. Side by side months play a boundary date on
  its in-month copy (#25).
- `TimePicker`: hour and minute fields that follow a given locale's hour cycle,
  separator, segment order and day-period words, independent of the device
  language (#23, beta.7).
- `PageIndicator`: continuous page indicator driven by UI-thread pager
  progress, with reversal, bounds, accessible value and reduced motion
  (beta.3).
- `ReorderableList`: accessible FlashList-backed drag reordering. The patched
  JS-only `react-native-drax` engine and its MIT license are bundled in the
  package (beta.4).
- `AlertDialog` `renderHeader`, `renderBody` and `renderActions` slots and a
  dark scrim (beta.4).
- Controlled `Accordion` disclosures (beta.5).

### Changed

- `RadioButton` uses `SelectionFeedback` instead of its own `Animated` fade;
  `selectionAnimation` (default `true`) turns it off (#25).
- `Typography` defaults `lineBreakStrategyIOS` to `hangul-word`, so wrapped
  Korean keeps words whole on iOS; an explicit value still wins (#22, beta.6).
- `react-native-svg` (>=15) is now a declared peer dependency, required by the
  charts (#24).

### Fixed

- `Button` derives leading and trailing icon colours from the flattened final
  style, so nested style arrays use the consumer's last override (#24).
- `AlertDialog` avoids the Android keyboard (`padding` on every native
  platform); edge-to-edge modals no longer hide fields under it (#22, beta.6).
- `EditText` reserves a complete native line box, so wrapping placeholders and
  large font scales no longer clip (#20, beta.6), and exposes the native
  editable element to screen readers (beta.3).
- `PinchZoom` yields single-finger swipes at rest to a native pager (#21,
  beta.6).
- Android press feedback in `Button`, `IconButton` and `CustomPressable` is
  bounded to the control; bare icon buttons keep a transparent background
  (beta.5).
- `Button` keeps string labels on one line and preserves its native content,
  label and loading parents through press and loading transitions (#15,
  beta.2; beta.5; #17).
- Collapsed `Accordion` panels unmount their controls (beta.5).

### Verification

- 37 Jest suites and 430 tests; 29/29 public components have regression tests
  and stories (105 stories).
- `bun run test:all`, `bun run build`, `bun run e2e-smoke`,
  `bun run storybook:build` and `npm pack --dry-run` run again in the trusted
  publish workflow.

## 0.8.0-beta.1 - 2026-09-04

### Added

- Allow AlertDialog to stay mounted in controlled mode via `visible` and
  `onClose`, so live forms keep focus across parent re-renders.
- Keep the AlertDialog title on the same row as the close control, and ignore
  outside taps when `closeOnTouchOutside` is false.

### Changed

- Pad text buttons `8px 16px`, hug the label instead of stretching full width,
  restore a real pressed underlay, and skip the solid disabled fill on text
  buttons.

### Verification

- 23 Jest suites and 302 tests.
- TypeScript package build, Storybook web build, E2E smoke, and npm tarball
  validation included in the release process.

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
