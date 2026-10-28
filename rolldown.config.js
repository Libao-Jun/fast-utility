import typescript from '@rollup/plugin-typescript';

export default {
  // 入口文件
  input: 'src/index.ts',
  // 输出双格式
  output: [
    // ESM（现代项目）
    { format: 'esm', file: 'dist/index.js', minify: true },
    // CJS（Node/旧项目）
    { format: 'cjs', file: 'dist/index.cjs', minify: true }
  ],
  // 插件
  plugins: [typescript({ tsconfig: './tsconfig.json' })]
};