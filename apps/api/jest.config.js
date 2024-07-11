/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.jest.json",
      },
    ],
    "^.+\\.js?$": "babel-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!@postgrator|prettier)/"],
  moduleNameMapper: {
    "^~/api/(.*)": "<rootDir>/$1",
  },
};
