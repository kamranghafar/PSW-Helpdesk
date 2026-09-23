module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,  // Set to 50% for initial scaffolding - TODO: raise to 80% after full implementation
      lines: 50,
      statements: 50
    }
  },
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true
};
