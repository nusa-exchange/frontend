module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  globals: {
    ZTypes: true,
    NodeJS: true
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "consistent-this": [2, "self", "vm"],
    "prefer-rest-params": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/class-name-casing": "off",
    "@typescript-eslint/getter-return": "off",
    "@typescript-eslint/no-constant-condition": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    
    "no-constant-condition": "off",
    "getter-return": "off",
    'prettier/prettier': process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/ban-types": "off",
    'no-inner-declarations': 'off'
  }
};
