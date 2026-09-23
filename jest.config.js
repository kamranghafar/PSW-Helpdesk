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
      functions: 50,  // TODO: Raise to 80% after scaffolding complete
      lines: 50,
      statements: 50
    }
  },
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true
};
