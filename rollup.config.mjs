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
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
      extract: false,
      inject: true,
      minimize: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
  external: ['react', 'react-dom'],
}
