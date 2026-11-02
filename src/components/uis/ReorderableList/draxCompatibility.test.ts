import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';

// Package-boundary guards, not substitutes for native gesture replay. A fresh
// dependency install must retain these fixes until Drax publishes them upstream.
const root = dirname(require.resolve('react-native-drax/package.json'));
describe('Drax dependency compatibility patch', () => {
  it('initializes gesture config from the first reaction, not React render', () => {
    for (const path of [
      'src/compat/useDraxPanGesture.ts',
      'lib/module/compat/useDraxPanGesture.js',
    ]) {
      const source = readFileSync(join(root, path), 'utf8');
      expect(source).toContain('useState(false)');
      expect(source).toContain('useState(0)');
      expect(source).not.toMatch(/useState\(\s*config\./);
      expect(source).not.toContain('prev !== null && current !== prev');
    }
  });
  it.each(['src', 'lib/module'])(
    'keeps overlays absolute in %s on RN 0.85+',
    (tree) => {
      const extension = tree === 'src' ? 'tsx' : 'js';
      for (const name of ['HoverLayer', 'DebugOverlay']) {
        const source = readFileSync(
          join(root, tree, `${name}.${extension}`),
          'utf8',
        );
        expect(source).toContain('...StyleSheet.absoluteFill,');
        expect(source).not.toContain('StyleSheet.absoluteFillObject');
      }
    },
  );
  it('resolves the snap callback after the container layout effect installs it', () => {
    for (const path of ['src/SortableItem.tsx', 'lib/module/SortableItem.js']) {
      const source = readFileSync(join(root, path), 'utf8');
      expect(source).toContain('sortable._internal.onItemSnapEnd?.();');
      expect(source).not.toMatch(/^\s+onItemSnapEnd,$/m);
    }
  });
});
