module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/utils/test-setup.js'],
  roots: [
    "<rootDir>",
  ],
  collectCoverageFrom: ["src/**/*.{js,jsx,mjs}"],
  testMatch: ["<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs}", "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,mjs}"],
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$"],
  moduleDirectories: ['node_modules', 'src'],
  transform: { "^.+\\.jsx?$": "babel-jest", },
  testEnvironment: 'jsdom',
};