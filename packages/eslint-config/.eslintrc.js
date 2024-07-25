module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  extends: [
    "airbnb",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "arrow-body-style": 0,
    "consistent-return": 0,
    "no-param-reassign": [0, { props: false }],
    "import/prefer-default-export": 0,
    "react/jsx-filename-extension": [0],
    "react/jsx-props-no-spreading": 0,
    "react/require-default-props": 0,
    "react/no-array-index-key": 0,
    "react/function-component-definition": 0,
    "react/button-has-type": 0,
    "react/jsx-no-constructed-context-values": 0,
    "no-confusing-arrow": 0,
    "react/prop-types": [2, { skipUndeclared: true }],
    "react/forbid-prop-types": ["error", { forbid: ["any"] }],
  },
};
