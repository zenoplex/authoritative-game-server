module.exports = {
  presets: [
    ['@babel/env', {
      "useBuiltIns": "usage",
      "corejs": "3"
    }],
    '@babel/typescript',
  ],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ],
}