# 0.8.0-beta.4 candidate

Scope: controlled AlertDialog render slots and dark scrim; FlashList-backed
ReorderableList with accessible handles and controlled persistence callbacks.

## Package boundary

- Drax1.1.0 is a JS-only engine using the host's existing Gesture Handler,
  Reanimated and Worklets peers. No Pod, Android library, native configuration
  plugin or permission is added.
- The exact patched engine is an npm bundled dependency, including its MIT
  license, TypeScript source and compiled modules. Bun patches alone would not
  reach npm consumers. There is no consumer postinstall mutation.
- `scripts/bundle-drax.js` refuses an unpatched install. `e2e-smoke` checks the
  packed dependency files, license and package-local module resolution.
- A clean Bun install of the candidate tarball resolved the engine inside
  `cpk-ui/node_modules/react-native-drax` with the snap fix and license intact.
- The runtime peer contract now explicitly requires React19, RN>=0.76 (New
  Architecture), FlashList2, Gesture Handler>=2.28 and Reanimated4.1+. Do not
  imply old-architecture compatibility from the previous broad peer ranges.

## Evidence (2026-09-09, Asia/Seoul; 2026-09-08 UTC)

- `test:all`:27 suites /337 tests PASS, types/lint/component/story coverage PASS.
- Library build, eight package/Metro smoke gates and Storybook build PASS.
- Physical Pixel10: reorder/reverse, edit after drop, save/reopen, scrolled
  range, long names, Dark/font1.5 and canceled confirmation PASS on the
  specifically recorded BooKoo development QA artifact. Its full provenance is
  maintained by the consumer; no private fixture data is copied here.
- Physical iPad automation preflight timed out before any test executed. The
  existing iOS26.5 BooKoo simulator was rebuilt with signing and app data intact;
  category drag, expanded editor, archive-dialog rendering and Cancel passed.
  Physical-iPad/full-app acceptance is not inferred from that focused replay.
- Live web CI preview at719e2db: mouse drag/reorder, keyboard reverse, Dark
  scrolled-range reorder, long titles and disabled semantics PASS. Custom
  header/body/actions and dark scrim were visually inspected. Body presses
  retain the dialog; Cancel closes it. Browser error log is empty.
- Review fixed outside-touch propagation and index-aware accessibility movement,
  with regression tests. Row wrappers no longer expose duplicate adjustable
  controls. Web mouse gestures start immediately; native touch retains its hold.
- The RNGH2 compatibility adapter now initializes from the first animated
  reaction rather than reading SharedValues in React render. This removes the
  repeated Reanimated render warnings observed during the native replay.
- An early local-browser connection error was left untouched. The successful
  web replay used the normal HTTPS preview produced by passing PR CI.

Publication authorization is explicit. Publish only after the remaining native
iOS/web checks, through the trusted main-branch GitHub workflow. This document
does not assert that beta.4 is already on npm or that any app OTA was deployed.
