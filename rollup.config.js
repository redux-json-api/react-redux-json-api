import pkg from './package.json';

export default {
  input: 'src/index.js',
  external: Object.keys(pkg.dependencies),
  output: [
    { file: pkg.browser, format: 'es' },
  ],
};
