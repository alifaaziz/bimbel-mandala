export default {
  testEnvironment: 'node',
  transform: {},
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/loaders/pino.js',
  ],
};