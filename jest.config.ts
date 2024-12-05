import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  preset: "ts-jest",
  silent: true,
  verbose: false,
  detectOpenHandles: true,
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/tests/e2e/"],
  moduleNameMapper: {
    // mapping the tsconfig paths, so jest can access them
    "^~/services/(.*)$": "<rootDir>/app/services/$1",
    "^~/components/(.*)$": "<rootDir>/app/components/$1",
    "^~/routes/(.*)$": "<rootDir>/app/routes/$1",
    "^~/(.*)$": "<rootDir>/app/$1",
  },
};
export default config;
