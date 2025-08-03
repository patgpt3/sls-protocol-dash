module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      isolatedModules: true,
      tsconfig: 'tsconfig.tests.json',
      ignoreCoverageForDecorators: true,
      ignoreCoverageForAllDecorators: true,
      babelConfig: {
        comments: false
      }
    }
  },
  coverageDirectory: './tests/jest/coverage/',
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testRegex: '/tests/jest/.*\\.test.(tsx?)$',
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/cypress/'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['jest-canvas-mock', '<rootDir>/tests/jest/setupEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  transformIgnorePatterns: [
    'node_modules',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  moduleNameMapper: {
    '@component(.*)$': '<rootDir>/src/component$1'
  },
  resolver: null
};
