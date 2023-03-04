module.exports = {
  extends: './../node_modules/ts-standard/eslintrc.json',
  env: {
    jest: true,
    browser: true,
    node: true
  },
  ignorePatterns: [
    'dist/**'
  ],
  parserOptions: {
    project: 'tsconfig.json'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/space-before-function-paren': 0,
    '@typescript-eslint/triple-slash-reference': 0
  }
}
