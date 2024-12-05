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
  },
};
export default config;
