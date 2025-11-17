import type {Config} from 'jest';

const config: Config = {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  preset: "ts-jest",
  testEnvironment: "jest-environment-node",
  testMatch: ["<rootDir>/src/**/*.test.ts"],

};

export default config;
