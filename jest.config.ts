import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleDirectories: ["node_modules", "src", "src/components", "public"],
  moduleNameMapper: {
    "next-auth/react": "<rootDir>/node_modules/next-auth/react",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/public/(.*)$": "<rootDir>/public/$1",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/features/shared/hooks/$1",
    "^@/shared/(.*)$": "<rootDir>/src/features/shared/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
    "^@/libs/(.*)$": "<rootDir>/src/libs/$1",
    "^@/services/(.*)$": "<rootDir>/src/services/$1",
    "^@/stores/(.*)$": "<rootDir>/src/stores/$1",
    "^@/clients/(.*)$": "<rootDir>/src/clients/$1",
    "^@/features/(.*)$": "<rootDir>/src/features/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
