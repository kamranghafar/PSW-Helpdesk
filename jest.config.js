module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js', // Exclude server entry point from coverage
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50, // Set to 50% per human instructions - TODO: raise to 80% after scaffolding
      lines: 50,
      statements: 50,
    },
  },
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
};
