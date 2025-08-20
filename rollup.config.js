import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    postcss({
      modules: true,
      extract: true,
      minimize: true,
      use: ['sass'],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['__tests__/**/*'],
    }),
  ],
  external: ['react', 'react-dom'],
}
