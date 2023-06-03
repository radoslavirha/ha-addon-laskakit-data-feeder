import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  verbose: false,
  clearMocks: true,
  resetMocks: true,
  testEnvironment: 'node',
  reporters: [ 'default', 'jest-junit' ],
  coverageDirectory: 'coverage',
  coverageReporters: [ 'clover', 'json', 'text', 'lcov', 'cobertura', 'text-summary', 'json-summary' ],
  collectCoverageFrom: [
    'lib/**/*.ts',
    'lib/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
        isolatedModules: true
      }
    ]
  },
  testMatch: [
    '**/*.(spec|test).ts'
  ]
};
export default config;