#!/usr/bin/env node

/**
 * Custom E2E Smoke Test Runner
 *
 * Validates that the app can actually build and run without runtime errors,
 * beyond what unit tests (with mocked native modules) can catch.
 *
 * Tests:
 * 1. Peer dependency compatibility
 * 2. Metro bundle compilation (web)
 * 3. Library build (tsc)
 * 4. Export resolution (all public exports are importable)
 *
 * Usage: node scripts/e2e-smoke.js
 */

const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RESULTS = [];
const TIMEOUT_MS = 120_000;

function log(icon, msg) {
  console.log(`${icon}  ${msg}`);
}

async function runTest(name, fn) {
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    RESULTS.push({name, status: 'pass', duration});
    log('\x1b[32m✓\x1b[0m', `${name} \x1b[90m(${duration}ms)\x1b[0m`);
    return true;
  } catch (err) {
    const duration = Date.now() - start;
    RESULTS.push({name, status: 'fail', duration, error: err.message});
    log('\x1b[31m✗\x1b[0m', `${name} \x1b[90m(${duration}ms)\x1b[0m`);
    console.log(`    \x1b[31m${err.message}\x1b[0m`);
    return false;
  }
}

function exec(cmd, opts = {}) {
  return execSync(cmd, {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: TIMEOUT_MS,
    stdio: 'pipe',
    ...opts,
  });
}

// --- Test 1: Peer dependency check ---
async function testPeerDeps() {
  const result = exec('node scripts/check-peer-deps.js');
  if (result.includes('critical peer dependency error')) {
    throw new Error('Peer dependency mismatches found');
  }
}

// --- Test 2: TypeScript compilation ---
async function testTypeCheck() {
  exec('npx tsc --noEmit');
}

// --- Test 3: Library build ---
async function testLibBuild() {
  exec('bun run build');
}

// --- Test 4: Export resolution ---
async function testExportResolution() {
  const indexPath = path.join(ROOT, 'src', 'index.tsx');
  const content = fs.readFileSync(indexPath, 'utf8');

  // Extract all export paths
  const exportPaths = [];
  const re = /export\s+.*from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    exportPaths.push(match[1]);
  }

  const missing = [];
  for (const ep of exportPaths) {
    const resolved = path.resolve(path.dirname(indexPath), ep);
    const candidates = [
      resolved,
      resolved + '.ts',
      resolved + '.tsx',
      resolved + '/index.ts',
      resolved + '/index.tsx',
    ];
    const exists = candidates.some((c) => fs.existsSync(c));
    if (!exists) {
      missing.push(ep);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing export sources:\n${missing.join('\n')}`);
  }
}

// --- Test 5: Metro bundle (web) ---
async function testMetroBundle() {
  // Try to create a web bundle to verify metro resolution works
  try {
    exec('npx expo export --platform web --output-dir /tmp/cpk-ui-e2e-smoke', {
      timeout: TIMEOUT_MS,
      env: {...process.env, NODE_ENV: 'production'},
    });
  } finally {
    // Cleanup
    try {
      exec('rm -rf /tmp/cpk-ui-e2e-smoke');
    } catch {
      // ignore cleanup errors
    }
  }
}

// --- Test 6: Built library import check ---
async function testLibImports() {
  const libDir = path.join(ROOT, 'lib');
  if (!fs.existsSync(libDir)) {
    throw new Error('lib/ directory not found. Run build first.');
  }

  // Check that key output files exist
  const expectedFiles = ['index.js', 'index.d.ts'];
  const missing = expectedFiles.filter(
    (f) => !fs.existsSync(path.join(libDir, f)),
  );

  if (missing.length > 0) {
    throw new Error(`Missing build outputs:\n${missing.join('\n')}`);
  }

  // Verify declaration files are generated for components
  const componentDirs = fs
    .readdirSync(path.join(ROOT, 'src', 'components', 'uis'))
    .filter((d) =>
      fs.statSync(path.join(ROOT, 'src', 'components', 'uis', d)).isDirectory(),
    );

  const missingDeclarations = [];
  for (const comp of componentDirs) {
    const declPath = path.join(libDir, 'components', 'uis', comp);
    if (!fs.existsSync(declPath)) {
      missingDeclarations.push(comp);
    }
  }

  if (missingDeclarations.length > 0) {
    throw new Error(
      `Missing component declarations:\n${missingDeclarations.join('\n')}`,
    );
  }
}

// --- Test 7: Native module compatibility matrix ---
async function testNativeModuleCompat() {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'),
  );
  const allDeps = {...pkg.dependencies, ...pkg.devDependencies};

  // Known compatibility rules for React Native ecosystem
  const rnVersion = allDeps['react-native']?.replace(/[~^]/g, '');
  const reactVersion = allDeps['react']?.replace(/[~^]/g, '');

  if (!rnVersion || !reactVersion) {
    throw new Error('Cannot determine react or react-native version');
  }

  const errors = [];

  // Check react-test-renderer matches react
  const rtrVersion = allDeps['react-test-renderer'];
  if (rtrVersion && rtrVersion.replace(/[~^]/g, '') !== reactVersion) {
    errors.push(
      `react-test-renderer (${rtrVersion}) must match react (${reactVersion})`,
    );
  }

  // Check installed native modules have compatible native code
  const nativeModules = [
    'react-native-reanimated',
    'react-native-gesture-handler',
    'react-native-safe-area-context',
    'react-native-svg',
  ];

  for (const nativeModule of nativeModules) {
    const modulePackage = path.join(
      ROOT,
      'node_modules',
      nativeModule,
      'package.json',
    );
    if (!fs.existsSync(modulePackage)) {
      errors.push(`${nativeModule} is not installed`);
    }
  }

  // Check worklets compatibility with reanimated
  const reanimatedPkg = path.join(
    ROOT,
    'node_modules',
    'react-native-reanimated',
    'package.json',
  );
  if (fs.existsSync(reanimatedPkg)) {
    const reaPkg = JSON.parse(fs.readFileSync(reanimatedPkg, 'utf8'));
    const requiredWorklets = reaPkg.peerDependencies?.['react-native-worklets'];
    if (requiredWorklets) {
      const workletsPkg = path.join(
        ROOT,
        'node_modules',
        'react-native-worklets',
        'package.json',
      );
      if (fs.existsSync(workletsPkg)) {
        const wPkg = JSON.parse(fs.readFileSync(workletsPkg, 'utf8'));
        // Simple major version check
        const requiredMajor = requiredWorklets
          .replace(/[~^>=]/g, '')
          .split('.')[1];
        const installedMajor = wPkg.version.split('.')[1];
        if (
          requiredMajor &&
          installedMajor &&
          requiredMajor !== installedMajor
        ) {
          errors.push(
            `react-native-reanimated requires react-native-worklets@${requiredWorklets} but ${wPkg.version} is installed`,
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}

// --- Main ---
async function main() {
  console.log('\n\x1b[1m🔍 CPK-UI E2E Smoke Tests\x1b[0m\n');
  console.log('─'.repeat(50));

  let allPassed = true;

  // Run tests sequentially (some depend on previous)
  const tests = [
    ['Peer dependency check', testPeerDeps],
    ['Native module compatibility', testNativeModuleCompat],
    ['TypeScript compilation', testTypeCheck],
    ['Export resolution', testExportResolution],
    ['Library build', testLibBuild],
    ['Build output verification', testLibImports],
    ['Metro web bundle', testMetroBundle],
  ];

  for (const [name, fn] of tests) {
    const passed = await runTest(name, fn);
    if (!passed) allPassed = false;
  }

  // Summary
  console.log('\n' + '─'.repeat(50));
  const passed = RESULTS.filter((r) => r.status === 'pass').length;
  const failed = RESULTS.filter((r) => r.status === 'fail').length;
  const totalTime = RESULTS.reduce((sum, r) => sum + r.duration, 0);

  if (allPassed) {
    console.log(
      `\n\x1b[32m✓ All ${passed} tests passed\x1b[0m \x1b[90m(${totalTime}ms)\x1b[0m\n`,
    );
  } else {
    console.log(
      `\n\x1b[31m✗ ${failed} of ${passed + failed} tests failed\x1b[0m \x1b[90m(${totalTime}ms)\x1b[0m\n`,
    );
    process.exit(1);
  }
}

main();
