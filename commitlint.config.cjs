const bodyMaxLineLength = 500;

const maxLineLength = (body, maxLength) => {
  // body를 줄 단위로 나누어 각 줄의 길이를 확인
  return body.split('\n').every((line) => line.length <= maxLength);
};

const validateBodyMaxLengthIgnoringDeps = (parsedCommit) => {
  const {type, scope, body} = parsedCommit;

  const isDepsCommit =
    type === 'chore' && (scope === 'deps' || scope === 'deps-dev');

  return [
    isDepsCommit || !body || maxLineLength(body, bodyMaxLineLength),
    `body's lines must not be longer than ${bodyMaxLineLength}`,
  ];
};

module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['commitlint-plugin-function-rules'],
  rules: {
    'body-max-line-length': [0],
    'function-rules/body-max-line-length': [
      2,
      'always',
      validateBodyMaxLengthIgnoringDeps,
    ],
  },
};
