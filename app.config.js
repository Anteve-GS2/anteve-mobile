const { execFileSync } = require('node:child_process');
const appJson = require('./app.json');

function getCommitHash() {
  const buildHash = process.env.EAS_BUILD_GIT_COMMIT_HASH || process.env.GIT_COMMIT;
  if (buildHash) return buildHash.slice(0, 7);

  try {
    return execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    throw new Error(
      'Não foi possível determinar o commit Git. Execute o build dentro de um repositório Git ou defina EAS_BUILD_GIT_COMMIT_HASH.'
    );
  }
}

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      ...appJson.expo.extra,
      commitHash: getCommitHash(),
    },
  },
};
