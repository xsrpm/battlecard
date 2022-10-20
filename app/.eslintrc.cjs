module.export = {
    "extends": "./node_modules/ts-standard/eslintrc.json",
    "env": {
      "jest": true,
      "browser": true,
      "node": true
    },
    "ignorePatterns": ["dist/**"],
    "parserOptions": {
      "project": "./tsconfig.json"
    },
    "rules": {
      "@typescript-eslint/explicit-function-return-type": 0
    }
  }
  