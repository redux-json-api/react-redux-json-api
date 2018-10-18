import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  external: Object.keys(pkg.dependencies).concat(
    Object.keys(pkg.peerDependencies),
  ),
  output: [
    { file: pkg.browser, format: 'es' },
  ],
  plugins: [
    babel({
      babelrc: false,
      presets: [['env', { modules: false }], 'flow', 'react'],
      plugins: [
        'external-helpers',
        'transform-class-properties',
        'transform-runtime',
        'transform-object-rest-spread',
      ],
      runtimeHelpers: true,
    }),
  ],
};
