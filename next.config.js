// next.config.js
const withTM = require('next-transpile-modules')([
  '@neetos/pixie-pptx/presentation',
]);

module.exports = withTM();