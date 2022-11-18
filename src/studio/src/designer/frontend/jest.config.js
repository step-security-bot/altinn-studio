const path = require('path');

/** @type {import('jest').Config} */
const config = {
  // cacheDirectory: path.join(__dirname),
  transform: {
    '\\.(ts|tsx|js)': '@swc/jest',
    // prettier-ignore
    'node_modules(\\\\|/)(react-dnd|dnd-core|@react-dnd|react-dnd-html5-backend|@?react-leaflet)(\\\\|/).+\\.(j|t)sx?$': '@swc/jest',
  },
  transformIgnorePatterns: [
    'node_modules(\\\\|/)(?!react-dnd|dnd-core|@react-dnd|react-dnd-html5-backend|@?react-leaflet)',
  ],
  reporters: ['default', 'jest-junit'],
  moduleNameMapper: {
    // prettier-ignore
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': path.join(__dirname, 'testing/mocks/fileMock.js'),
    '\\.(css|less)$': path.join(__dirname, 'testing/mocks/styleMock.js'),
    'monaco-editor': path.join(__dirname, 'testing/mocks/fileMock.js'),
    '^app-shared/(.*)': path.join(__dirname, 'shared/$1'),
    // prettier-ignore
    '^@altinn/schema-editor/(.*)': path.join(__dirname, 'packages/schema-editor/src/$1',),
    '^@altinn/schema-model/(.*)': path.join(__dirname, 'packages/schema-model/src/$1',),
    '^uuid$': path.join(__dirname, 'node_modules/uuid/dist/index.js'),
  },
  testRegex: '(\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [path.join(__dirname, 'testing/setupTests.ts')],
};

if (process.env.CI) {
  config.reporters.push('github-actions');
}
module.exports = config;
