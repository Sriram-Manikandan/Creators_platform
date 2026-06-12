module.exports = {
  testEnvironment: 'jsdom',
  rootDir: __dirname,
  setupFilesAfterEnv: [require('path').join(__dirname, 'src', 'setupTests.cjs')],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
