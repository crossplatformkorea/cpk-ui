const env = process.env;

const isDryRun = ['1', 'true'].includes(env.npm_config_dry_run);
const isReleaseWorkflow =
  env.CI === 'true' &&
  env.GITHUB_ACTIONS === 'true' &&
  env.GITHUB_EVENT_NAME === 'workflow_dispatch' &&
  env.GITHUB_REPOSITORY === 'crossplatformkorea/cpk-ui' &&
  env.GITHUB_REF === 'refs/heads/main' &&
  env.GITHUB_WORKFLOW_REF?.startsWith(
    'crossplatformkorea/cpk-ui/.github/workflows/publish.yml@',
  );

if (!isDryRun && !isReleaseWorkflow) {
  console.error(
    'Publishing is restricted to the main-branch GitHub Actions publish workflow.',
  );
  process.exit(1);
}
