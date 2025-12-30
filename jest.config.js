module.exports = {
  testEnvironment: 'node',
  rootDir: './backend',
  testTimeout: 120000, // 120 seconds for CI environments
  testMatch: ['**/tests/**/*.test.js'],
  forceExit: true, // Force Jest to exit after tests complete
  detectOpenHandles: true, // Detect open handles
  verbose: true,
};
