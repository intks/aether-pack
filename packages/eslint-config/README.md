# ESLint Config

[eslint shareable config](https://eslint.org/docs/developer-guide/shareable-configs)

based on

- eslint-config-airbnb
- eslint-plugin-import
- eslint-plugin-jsx-a11y
- eslint-plugin-react
- eslint-plugin-react-hooks
- eslint-import-resolver-alias

## Usage

```sh
yarn add -D eslint @nerium/eslint-config @babel/core @babel/eslint-parser
```

create a `.eslintrc.js`

```js
module.exports = {
  extends: '@nerium',
};
```
