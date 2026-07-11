#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'src', 'index.tsx');
const sourceText = fs.readFileSync(indexPath, 'utf8');
const sourceFile = ts.createSourceFile(
  indexPath,
  sourceText,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);

const componentExports = sourceFile.statements
  .filter(ts.isExportDeclaration)
  .map((statement) => statement.moduleSpecifier)
  .filter((specifier) => specifier && ts.isStringLiteral(specifier))
  .map((specifier) => specifier.text)
  .filter((modulePath) => modulePath.startsWith('./components/'));

function unwrapExpression(expression) {
  let current = expression;

  while (
    ts.isAsExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }

  return current;
}

function getProperty(object, name) {
  return object.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) &&
      ((ts.isIdentifier(property.name) && property.name.text === name) ||
        (ts.isStringLiteral(property.name) && property.name.text === name)),
  );
}

function getNestedProperty(object, pathSegments) {
  let current = object;

  for (const segment of pathSegments) {
    const property = getProperty(current, segment);
    if (!property) return undefined;

    const value = unwrapExpression(property.initializer);
    if (segment === pathSegments.at(-1)) return value;
    if (!ts.isObjectLiteralExpression(value)) return undefined;
    current = value;
  }

  return undefined;
}

const qualityFailures = [];
let storyCount = 0;

const missingStories = componentExports.filter((modulePath) => {
  const componentDirectory = path.dirname(
    path.resolve(path.dirname(indexPath), modulePath),
  );
  const storyFile = fs
    .readdirSync(componentDirectory)
    .find((file) => /\.stories\.(js|jsx|ts|tsx)$/.test(file));

  if (!storyFile) return true;

  const storyPath = path.join(componentDirectory, storyFile);
  const storySource = fs.readFileSync(storyPath, 'utf8');
  const storyAst = ts.createSourceFile(
    storyPath,
    storySource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const metaDeclaration = storyAst.statements
    .filter(ts.isVariableStatement)
    .flatMap((statement) => [...statement.declarationList.declarations])
    .find(
      (declaration) =>
        ts.isIdentifier(declaration.name) && declaration.name.text === 'meta',
    );
  const metaValue = metaDeclaration?.initializer
    ? unwrapExpression(metaDeclaration.initializer)
    : undefined;
  const relativePath = path.relative(root, storyPath);

  if (!metaValue || !ts.isObjectLiteralExpression(metaValue)) {
    qualityFailures.push(`${relativePath}: missing structured meta object`);
    return false;
  }

  const titleValue = getNestedProperty(metaValue, ['title']);
  const allowedCategories = [
    'Actions',
    'Display',
    'Feedback',
    'Foundations',
    'Inputs',
    'Media',
    'System',
  ];
  const title = ts.isStringLiteral(titleValue) ? titleValue.text : undefined;
  if (
    !title ||
    !allowedCategories.some((category) => title.startsWith(`${category}/`))
  ) {
    qualityFailures.push(
      `${relativePath}: invalid or missing navigation title`,
    );
  }

  if (!getNestedProperty(metaValue, ['component'])) {
    qualityFailures.push(`${relativePath}: missing component metadata`);
  }
  if (!getNestedProperty(metaValue, ['decorators'])) {
    qualityFailures.push(`${relativePath}: missing theme decorator`);
  }
  if (
    !getNestedProperty(metaValue, [
      'parameters',
      'docs',
      'description',
      'component',
    ])
  ) {
    qualityFailures.push(`${relativePath}: missing component documentation`);
  }
  if (getNestedProperty(metaValue, ['parameters', 'notes'])) {
    qualityFailures.push(
      `${relativePath}: legacy notes duplicate the docs page`,
    );
  }

  const exportedStories = storyAst.statements
    .filter(ts.isVariableStatement)
    .filter((statement) =>
      statement.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
      ),
    )
    .flatMap((statement) => [...statement.declarationList.declarations])
    .filter((declaration) => ts.isIdentifier(declaration.name));
  storyCount += exportedStories.length;

  if (exportedStories.length < 2) {
    qualityFailures.push(`${relativePath}: add at least two visual states`);
  }

  const genericCopy = /## Features|\bA (?:flexible|versatile|powerful)\b/i;
  if (genericCopy.test(storySource)) {
    qualityFailures.push(`${relativePath}: replace generic feature-list copy`);
  }

  return false;
});

if (missingStories.length > 0) {
  console.error('Public components without a colocated Storybook story:');
  for (const modulePath of missingStories) {
    console.error(`- ${modulePath}`);
  }
  process.exit(1);
}

if (qualityFailures.length > 0) {
  console.error('Storybook quality checks failed:');
  for (const failure of qualityFailures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Storybook quality: ${componentExports.length}/${componentExports.length} public components, ${storyCount} stories`,
);
