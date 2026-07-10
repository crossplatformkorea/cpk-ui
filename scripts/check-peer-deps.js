#!/usr/bin/env node

/**
 * Peer Dependency Checker
 *
 * Scans node_modules and verifies that all peer dependencies
 * are satisfied with compatible versions.
 *
 * Usage: node scripts/check-peer-deps.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NODE_MODULES = path.join(ROOT, 'node_modules');

// Packages whose peer dep warnings are known-safe and can be ignored.
// These are packages that haven't updated their peerDependencies yet
// but are confirmed to work at runtime.
const IGNORE_PACKAGES = [
  '@storybook/*',
  '@testing-library/react-hooks', // deprecated, use @testing-library/react instead
];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function getInstalledVersion(packageName) {
  const pkgJson = readJson(
    path.join(NODE_MODULES, packageName, 'package.json'),
  );
  return pkgJson?.version || null;
}

/**
 * Simple semver range check supporting ^, ~, >=, >, <=, <, *, x, and || ranges.
 */
function satisfies(version, range) {
  if (!version || !range) return false;

  range = range.trim();
  if (range === '*' || range === '') return true;

  const parseVersion = (v) => {
    const clean = v.replace(/^[~^>=<\s]+/, '').replace(/-.*$/, '');
    const parts = clean.split('.').map((p) => {
      if (p === 'x' || p === '*') return 0;
      const n = parseInt(p);
      return isNaN(n) ? 0 : n;
    });
    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0,
    };
  };

  const compare = (a, b) => {
    if (a.major !== b.major) return a.major - b.major;
    if (a.minor !== b.minor) return a.minor - b.minor;
    return a.patch - b.patch;
  };

  // Handle || (union ranges)
  if (range.includes('||')) {
    return range.split('||').some((r) => satisfies(version, r.trim()));
  }

  // Handle space-separated intersection (e.g. ">=16.0.0 <19.0.0")
  // But first, check if there is a single operator with spaces (e.g. ">= 16.8.0")
  const normalized = range.replace(/(>=|<=|>|<|~|\^)\s+/g, '$1');
  const spaceTokens = normalized.trim().split(/\s+/);
  if (spaceTokens.length >= 2) {
    return spaceTokens.every((p) => satisfies(version, p));
  }

  const singleRange = spaceTokens[0];
  const installed = parseVersion(version);
  const required = parseVersion(singleRange);

  if (singleRange.startsWith('>=')) {
    return compare(installed, required) >= 0;
  }

  if (singleRange.startsWith('>') && !singleRange.startsWith('>=')) {
    return compare(installed, required) > 0;
  }

  if (singleRange.startsWith('<=')) {
    return compare(installed, required) <= 0;
  }

  if (singleRange.startsWith('<') && !singleRange.startsWith('<=')) {
    return compare(installed, required) < 0;
  }

  if (singleRange.startsWith('~')) {
    // ~: major.minor must match, patch >= required
    return (
      installed.major === required.major &&
      installed.minor === required.minor &&
      installed.patch >= required.patch
    );
  }

  if (singleRange.startsWith('^')) {
    // ^: compatible with version
    if (required.major > 0) {
      return (
        installed.major === required.major && compare(installed, required) >= 0
      );
    }
    // ^0.x.y: minor must match
    if (required.minor > 0) {
      return (
        installed.major === required.major &&
        installed.minor === required.minor &&
        installed.patch >= required.patch
      );
    }
    // ^0.0.x: exact match
    return (
      installed.major === required.major &&
      installed.minor === required.minor &&
      installed.patch === required.patch
    );
  }

  // Exact or plain version: major must match at minimum
  return installed.major === required.major;
}

function getDirectDeps() {
  const rootPkg = readJson(path.join(ROOT, 'package.json'));
  return {
    ...rootPkg.dependencies,
    ...rootPkg.devDependencies,
  };
}

function scanPeerDeps() {
  const directDeps = getDirectDeps();
  const errors = [];
  const warnings = [];

  const packagesToCheck = Object.keys(directDeps);

  const isIgnored = (name) =>
    IGNORE_PACKAGES.some((pattern) => {
      if (pattern.endsWith('/*')) {
        return name.startsWith(pattern.slice(0, -1));
      }
      return name === pattern;
    });

  for (const pkgName of packagesToCheck) {
    if (isIgnored(pkgName)) continue;

    const pkgJson = readJson(path.join(NODE_MODULES, pkgName, 'package.json'));
    if (!pkgJson?.peerDependencies) continue;

    for (const [peerName, peerRange] of Object.entries(
      pkgJson.peerDependencies,
    )) {
      const installedVersion = getInstalledVersion(peerName);
      const isOptional =
        pkgJson.peerDependenciesMeta?.[peerName]?.optional === true;

      if (!installedVersion) {
        if (isOptional) continue;
        warnings.push({
          package: pkgName,
          peer: peerName,
          required: peerRange,
          installed: 'NOT INSTALLED',
          optional: isOptional,
        });
        continue;
      }

      if (!satisfies(installedVersion, peerRange)) {
        errors.push({
          package: pkgName,
          peer: peerName,
          required: peerRange,
          installed: installedVersion,
          optional: isOptional,
        });
      }
    }
  }

  return {errors, warnings};
}

// --- Main ---
console.log('Checking peer dependencies...\n');

const {errors, warnings} = scanPeerDeps();

if (warnings.length > 0) {
  console.log(
    `\x1b[33m⚠  ${warnings.length} missing peer dependencies:\x1b[0m\n`,
  );
  for (const w of warnings) {
    console.log(
      `  \x1b[33m${w.package}\x1b[0m requires \x1b[36m${w.peer}@${w.required}\x1b[0m → not installed`,
    );
  }
  console.log();
}

if (errors.length > 0) {
  console.log(
    `\x1b[31m✗  ${errors.length} incompatible peer dependencies:\x1b[0m\n`,
  );
  for (const e of errors) {
    const label = e.optional ? ' (optional)' : '';
    console.log(
      `  \x1b[31m${e.package}\x1b[0m requires \x1b[36m${e.peer}@${e.required}\x1b[0m → installed \x1b[31m${e.installed}\x1b[0m${label}`,
    );
  }
  console.log();
}

const criticalErrors = errors.filter((e) => !e.optional);

if (criticalErrors.length > 0) {
  console.log(
    `\x1b[31m✗ ${criticalErrors.length} critical peer dependency error(s) found. Fix before deploying.\x1b[0m`,
  );
  process.exit(1);
} else if (errors.length > 0 || warnings.length > 0) {
  console.log(
    `\x1b[33m⚠ No critical errors, but ${errors.length + warnings.length} issue(s) found.\x1b[0m`,
  );
  process.exit(0);
} else {
  console.log('\x1b[32m✓ All peer dependencies are satisfied.\x1b[0m');
  process.exit(0);
}
