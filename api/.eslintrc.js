module.exports = {
  extends: './../node_modules/ts-standard/eslintrc.json',
  env: {
    jest: true,
    browser: true,
    node: true
  },
  ignorePatterns: [
    'build/**'
  ],
  parserOptions: {
    project: 'tsconfig.json'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0
  }
}
