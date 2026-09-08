#!/usr/bin/env node

// Bun dependency patches do not propagate through npm. Bundle this exact
// patched JS-only engine so registry consumers get the tested implementation
// without postinstall writes to their dependencies. Preserve its MIT license.
const {cpSync, mkdirSync, readFileSync} = require('node:fs');
const {dirname, join, resolve} = require('node:path');

const root = resolve(__dirname, '..');
const engine = dirname(require.resolve('react-native-drax/package.json'));
const metadata = JSON.parse(readFileSync(join(engine, 'package.json'), 'utf8'));
if (metadata.version !== '1.1.0')
  throw new Error('Re-audit the Drax bundle version');

const checks = [
  ['lib/module/HoverLayer.js', '...StyleSheet.absoluteFill,'],
  ['lib/module/SortableItem.js', 'sortable._internal.onItemSnapEnd?.();'],
  ['lib/module/hooks/useSortableList.js', 'flushVisualOrder();'],
];
for (const [file, marker] of checks) {
  if (!readFileSync(join(engine, file), 'utf8').includes(marker)) {
    throw new Error(`Refuse to bundle unpatched Drax: ${file}`);
  }
}
const destination = join(root, 'lib/node_modules/react-native-drax');
mkdirSync(destination, {recursive: true});
for (const file of ['src', 'lib', 'package.json', 'LICENSE.md', 'README.md']) {
  cpSync(join(engine, file), join(destination, file), {recursive: true});
}
console.log('Bundled patched react-native-drax@1.1.0 with MIT license');
