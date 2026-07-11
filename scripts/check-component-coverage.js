#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'src', 'index.tsx');
const sourceFile = ts.createSourceFile(
  indexPath,
  fs.readFileSync(indexPath, 'utf8'),
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

const missingTests = componentExports.filter((modulePath) => {
  const componentDirectory = path.dirname(
    path.resolve(path.dirname(indexPath), modulePath),
  );
  return !fs
    .readdirSync(componentDirectory)
    .some((file) => /\.test\.(js|jsx|ts|tsx)$/.test(file));
});

if (missingTests.length > 0) {
  console.error('Public components without a colocated regression test:');
  for (const modulePath of missingTests) {
    console.error(`- ${modulePath}`);
  }
  process.exit(1);
}

console.log(
  `Component regression coverage: ${componentExports.length}/${componentExports.length} public components`,
);
