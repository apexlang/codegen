const { defaultsESM: tsjPreset } = require("ts-jest/presets");

module.exports = {
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      { useESM: true, tsconfig: "./test/tsconfig.test.json" },
    ],
  },
  resolver: "ts-jest-resolver",
  transformIgnorePatterns: [".*/node_modules/.*"],
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/templates/"],
  // testRegex: "/test/.*\\.test\\.ts$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  extensionsToTreatAsEsm: [".ts"],
};
