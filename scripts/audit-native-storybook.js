#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');
const {setTimeout} = require('timers');

const ROOT = path.resolve(__dirname, '..');
const STORY_INDEX = path.join(ROOT, 'storybook-static', 'index.json');

function parseArgs(argv) {
  const options = {
    delay: 650,
    output: undefined,
    platform: 'ios',
    port: 8081,
    startupDelay: undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];

    if (argument === '--platform' && value) {
      options.platform = value;
      index += 1;
    } else if (argument === '--port' && value) {
      options.port = Number(value);
      index += 1;
    } else if (argument === '--delay' && value) {
      options.delay = Number(value);
      index += 1;
    } else if (argument === '--output' && value) {
      options.output = path.resolve(value);
      index += 1;
    } else if (argument === '--startup-delay' && value) {
      options.startupDelay = Number(value);
      index += 1;
    } else if (argument === '--limit' && value) {
      options.limit = Number(value);
      index += 1;
    } else {
      throw new Error(`Unknown or incomplete argument: ${argument}`);
    }
  }

  if (!['ios', 'android'].includes(options.platform)) {
    throw new Error('--platform must be either ios or android');
  }

  options.startupDelay ??= options.platform === 'android' ? 25_000 : 6_000;

  if (
    !Number.isFinite(options.port) ||
    !Number.isFinite(options.delay) ||
    !Number.isFinite(options.startupDelay)
  ) {
    throw new Error('--port, --delay, and --startup-delay must be numbers');
  }

  options.output ??= path.join(
    '/tmp',
    `cpk-ui-storybook-audit-${options.platform}`,
  );

  return options;
}

function run(command, args, options = {}) {
  const encoding = Object.prototype.hasOwnProperty.call(options, 'encoding')
    ? options.encoding
    : 'utf8';
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding,
    env: process.env,
    maxBuffer: options.maxBuffer ?? 10 * 1024 * 1024,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = Buffer.isBuffer(result.stderr)
      ? result.stderr.toString('utf8')
      : result.stderr;
    throw new Error(
      `${command} ${args.join(' ')} failed: ${stderr || result.stdout || ''}`,
    );
  }

  return result.stdout;
}

function getStoryIds(limit) {
  if (!fs.existsSync(STORY_INDEX)) {
    throw new Error(
      'storybook-static/index.json is missing; run build-storybook first',
    );
  }

  const index = JSON.parse(fs.readFileSync(STORY_INDEX, 'utf8'));
  const storyIds = Object.values(index.entries)
    .filter(
      (entry) =>
        entry.type === 'story' &&
        entry.importPath.startsWith('./src/components/'),
    )
    .map((entry) => entry.id);

  return limit ? storyIds.slice(0, limit) : storyIds;
}

function getAndroidArgs(args) {
  return process.env.ANDROID_SERIAL
    ? ['-s', process.env.ANDROID_SERIAL, ...args]
    : args;
}

function openStory({platform, port}, storyId) {
  const host = platform === 'ios' ? '127.0.0.1' : '10.0.2.2';
  const url = `exp://${host}:${port}/--/?STORYBOOK_STORY_ID=${encodeURIComponent(storyId)}`;

  if (platform === 'ios') {
    run('xcrun', [
      'simctl',
      'openurl',
      process.env.IOS_DEVICE || 'booted',
      url,
    ]);
    return;
  }

  run(
    'adb',
    getAndroidArgs([
      'shell',
      'am',
      'start',
      '-W',
      '-a',
      'android.intent.action.VIEW',
      '-d',
      url,
      'host.exp.exponent',
    ]),
  );
}

function restartStorybook(options, storyId) {
  if (options.platform === 'ios') {
    try {
      run('xcrun', [
        'simctl',
        'terminate',
        process.env.IOS_DEVICE || 'booted',
        'host.exp.Exponent',
      ]);
    } catch {
      // Expo Go may not be running yet.
    }
  } else {
    run(
      'adb',
      getAndroidArgs(['shell', 'am', 'force-stop', 'host.exp.exponent']),
    );
  }

  openStory(options, storyId);
}

function captureScreenshot({platform}, screenshotPath) {
  if (platform === 'ios') {
    run('xcrun', [
      'simctl',
      'io',
      process.env.IOS_DEVICE || 'booted',
      'screenshot',
      '--mask=black',
      screenshotPath,
    ]);
    return;
  }

  const png = run('adb', getAndroidArgs(['exec-out', 'screencap', '-p']), {
    encoding: null,
  });
  fs.writeFileSync(screenshotPath, png);
}

function hashFile(filePath) {
  return crypto
    .createHash('sha256')
    .update(fs.readFileSync(filePath))
    .digest('hex');
}

const wait = (duration) =>
  new Promise((resolve) => {
    setTimeout(resolve, duration);
  });

async function waitForAndroidStory(storyId) {
  let activeStoryId;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const hierarchy = run(
      'adb',
      getAndroidArgs(['exec-out', 'uiautomator', 'dump', '/dev/tty']),
      {maxBuffer: 25 * 1024 * 1024},
    );

    if (hierarchy.includes(`resource-id="${storyId}"`)) {
      return;
    }

    activeStoryId = hierarchy.match(
      /resource-id="([^"]+--[^"]+)" content-desc=/,
    )?.[1];
    await wait(350);
  }

  throw new Error(
    `story did not become active (expected ${storyId}, ` +
      `received ${activeStoryId || 'unknown'})`,
  );
}

async function waitForIosStory(storyId) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const logs = run('xcrun', [
      'simctl',
      'spawn',
      process.env.IOS_DEVICE || 'booted',
      'log',
      'show',
      '--last',
      '30s',
      '--style',
      'compact',
      '--predicate',
      'process == "Expo Go"',
    ]);

    if (
      logs.includes(`navigating to story: ${storyId}`) ||
      logs.includes(`storyId: ${storyId}`)
    ) {
      return;
    }

    await wait(500);
  }

  throw new Error(`story did not become active (expected ${storyId})`);
}

function formatLogDate(date) {
  const pad = (value) => String(value).padStart(2, '0');

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const storyIds = getStoryIds(options.limit);
  const results = [];
  const auditStartedAt = new Date();

  if (storyIds.length === 0) {
    throw new Error('no native Storybook stories were found');
  }

  fs.rmSync(options.output, {force: true, recursive: true});
  fs.mkdirSync(options.output, {recursive: true});

  if (options.platform === 'android') {
    run('adb', getAndroidArgs(['logcat', '-c']));
  }

  restartStorybook(options, storyIds[0]);
  await wait(options.startupDelay);

  for (const [index, storyId] of storyIds.entries()) {
    const screenshotPath = path.join(
      options.output,
      `${String(index + 1).padStart(2, '0')}-${storyId}.png`,
    );

    try {
      openStory(options, storyId);

      if (options.platform === 'ios') {
        await waitForIosStory(storyId);
      } else {
        await waitForAndroidStory(storyId);
      }

      await wait(options.delay);

      captureScreenshot(options, screenshotPath);

      const bytes = fs.statSync(screenshotPath).size;
      if (bytes < 5_000) {
        throw new Error(`screenshot is unexpectedly small (${bytes} bytes)`);
      }

      results.push({
        bytes,
        hash: hashFile(screenshotPath),
        screenshotPath,
        status: 'passed',
        storyId,
      });
      console.log(`[${index + 1}/${storyIds.length}] ${storyId}`);
    } catch (error) {
      results.push({
        error: error instanceof Error ? error.message : String(error),
        screenshotPath,
        status: 'failed',
        storyId,
      });
      console.error(`[${index + 1}/${storyIds.length}] ${storyId}: failed`);
    }
  }

  const passed = results.filter((result) => result.status === 'passed');
  const failed = results.filter((result) => result.status === 'failed');
  const uniqueScreenshots = new Set(passed.map((result) => result.hash)).size;
  const minimumUniqueScreenshots =
    storyIds.length >= 10 ? Math.ceil(storyIds.length * 0.5) : 1;
  const runtimeErrors = [];

  if (options.platform === 'android') {
    const logcat = run('adb', getAndroidArgs(['logcat', '-d', '-v', 'brief']), {
      maxBuffer: 50 * 1024 * 1024,
    });
    const errorPattern =
      /Error while updating property|FATAL EXCEPTION|JSApplicationIllegalArgumentException|ReactNativeJS.*(?:TypeError|Invariant Violation)/;

    runtimeErrors.push(
      ...logcat
        .split('\n')
        .filter((line) => errorPattern.test(line))
        .slice(0, 50),
    );
  } else {
    const logs = run(
      'xcrun',
      [
        'simctl',
        'spawn',
        process.env.IOS_DEVICE || 'booted',
        'log',
        'show',
        '--start',
        formatLogDate(auditStartedAt),
        '--style',
        'compact',
        '--predicate',
        'process == "Expo Go"',
      ],
      {maxBuffer: 50 * 1024 * 1024},
    );
    const errorPattern =
      /ErrorBoundary caught an error|Fatal JavaScript|Render Error|Unhandled JS Exception|ReactNativeJS.*(?:TypeError|Invariant Violation)/;

    runtimeErrors.push(
      ...logs
        .split('\n')
        .filter((line) => errorPattern.test(line))
        .slice(0, 50),
    );
  }

  const integrityPassed =
    failed.length === 0 &&
    runtimeErrors.length === 0 &&
    uniqueScreenshots >= minimumUniqueScreenshots;
  const report = {
    completedAt: new Date().toISOString(),
    failed: failed.length,
    integrityPassed,
    minimumUniqueScreenshots,
    output: options.output,
    passed: passed.length,
    platform: options.platform,
    results,
    runtimeErrors,
    stories: storyIds.length,
    uniqueScreenshots,
  };

  fs.writeFileSync(
    path.join(options.output, 'report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );

  console.log(
    `Native Storybook audit: ${passed.length}/${storyIds.length} passed, ` +
      `${uniqueScreenshots} unique screenshots, ` +
      `${runtimeErrors.length} runtime errors`,
  );

  if (!integrityPassed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
