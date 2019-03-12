import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'

import pkg from './package.json'

const input = 'src/index.js'

const commonjsPlugin = commonjs()
const resolvePlugin = resolve()
const babelPlugin = babel({
  runtimeHelpers: true,
  exclude: 'node_modules/**',
})

export default [
  {
    input,
    output: {
      name: pkg.name,
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [resolvePlugin, babelPlugin, commonjsPlugin, uglify()],
  },
  {
    input: 'src/index.js',
    external: ['ms'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
]
