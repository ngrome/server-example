module.exports = {
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    "transform": {
      "^.+\\.(ts|tsx)?$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
      "^.+\\.jsx?$": "babel-jest"
    },
    verbose: true,
    testMatch: ["**/tests/*.test.(ts|tsx|js|jsx)"],
    moduleDirectories: ["node_modules"]
  };