// Rollup plugins
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/yip.js',
  format: 'iife',
  moduleName: 'yip',
  plugins: [
    //babel({
    //  exclude: 'node_modules/**',
    //  presets: ['es2015-script'],
    //})
  ],
};
