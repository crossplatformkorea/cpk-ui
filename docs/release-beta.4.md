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

## Evidence (September9)

- `test:all`:27 suites /332 tests PASS, types/lint/component/story coverage PASS.
- Library build, eight package/Metro smoke gates and Storybook build PASS.
- Physical Pixel10: reorder/reverse, edit after drop, save/reopen, scrolled
  range, long names, Dark/font1.5 and canceled confirmation PASS on the
  specifically recorded BooKoo development QA artifact. Its full provenance is
  maintained by the consumer; no private fixture data is copied here.
- Physical iPad automation preflight again timed out before any test executed;
  connection alone does not pass the native iOS gate. Simulator parity pending.
- Live web interaction pending: the browser adapter is stuck on its blocked
  data-URL connection-error page even after the server responds HTTP200.
  Do not bypass the browser policy or present compilation as interaction QA.

Publication authorization is explicit. Publish only after the remaining native
iOS/web checks, through the trusted main-branch GitHub workflow. This document
does not assert that beta.4 is already on npm or that any app OTA was deployed.
