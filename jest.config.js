module.exports = {
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy"
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    "jest-dom/extend-expect",
    "react-testing-library/cleanup-after-each"
  ],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!**/*.d.ts"],
  preset: "ts-jest",
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  }
};
