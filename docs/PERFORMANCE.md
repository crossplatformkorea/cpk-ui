# Performance

cpk-ui treats performance as a release property, not a list of hooks applied to
every component. Optimizations are kept when they remove measured work or make
render behavior more predictable without hiding stale-state bugs.

## Architecture

### Compile-time styling

cpk-ui 0.7.0 uses kstyled 0.4.1. Static template declarations are extracted by
the Babel plugin, while prop- and theme-dependent values remain small runtime
patches. Strict compiler mode is enabled in the repository so unsupported
templates fail CI.

### Stable interaction paths

Interactive components keep event handlers and animated values stable where it
prevents repeated subscriptions or allocation. Memoization is not applied
indiscriminately; simple values remain simple, and dependency arrays are tested
through controlled state transitions.

### Icon loading

The icon component creates its glyph map from the typed icon name list. The
IcoMoon `selection.json` file is no longer imported at runtime or copied into
the npm package. The font remains the source of the glyph data.

## Package Baseline

The 0.7.0 release dry-run is approximately:

| Metric           |  Before |  0.7.0 |
| ---------------- | ------: | -----: |
| npm tarball      |  5.5 MB | 3.9 MB |
| unpacked package | 13.1 MB | 6.8 MB |

The largest remaining published assets are the Pretendard font files and the
cpk icon font. They are intentional compatibility costs and should be reviewed
before adding another bundled font weight.

## Validation

Run the same checks used by the release workflow:

```bash
bun run test:all
bun run build
bun run e2e-smoke
bun run storybook:build
bun run pack:dry
```

`pack:dry` is the authoritative package-size check because it measures the
exact `lib` contents sent to npm. Storybook asset warnings are tracked
separately because demo images are not part of the npm package.

## Consumer Guidance

- Keep `kstyled` and `babel-plugin-kstyled` on the same version.
- Enable `strict: true` in CI.
- Pass stable object and callback props to components rendered in long lists.
- Use transient `$props` for style-only values in custom kstyled components.
- Profile production builds on the target platform before adding memoization.
