import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  coverageReporters: ["json", "lcov", "text", "clover"],
  collectCoverage: true,
  moduleFileExtensions: ["js", "json", "ts"],
  testEnvironment: "node",
  testMatch: ["**/tests/tdd/**/*.spec.ts"],
  preset: "ts-jest",
  rootDir: "../",
  coverageDirectory: "<rootDir>/coverage",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  collectCoverageFrom:[
    "src/**/*.service.ts",
    "src/**/*.controller.ts",
    "!**/src/utils/**/*.type.ts",
    "!**/**/dto/**",
    "!**/**/mocks/**",
    "!**/*.module.ts"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/coverage/"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};

export default config;
