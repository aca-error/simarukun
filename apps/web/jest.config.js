/** @type {import('ts-jest').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  rootDir: 'src',
  testRegex: '.*\\.(test|spec)\\.(ts|tsx)$',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageDirectory: '../coverage',
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.css$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
