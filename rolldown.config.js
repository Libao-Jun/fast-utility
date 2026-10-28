import typescript from '@rollup/plugin-typescript';
import { dts } from 'rolldown-plugin-dts';

/**
 * 构建结构参考 radash：
 * - npm 产物（ESM / CJS）保留可读代码，压缩交给使用方的构建工具
 * - 额外产出 IIFE 全局包，便于 <script> 直接引入或经 CDN 使用
 * - 类型声明单独打包为单个 `dist/index.d.ts`，产物中不含相对导入
 */
export default [
  {
    input: 'src/index.ts',
    plugins: [typescript({ tsconfig: './tsconfig.json' })],
    output: [
      {
        format: 'esm',
        file: 'dist/index.js',
        comments: false
      },
      {
        format: 'cjs',
        file: 'dist/index.cjs',
        comments: false
      },
      {
        format: 'iife',
        name: 'fastUtility',
        file: 'dist/index.global.js',
        comments: false
      },
      {
        format: 'iife',
        name: 'fastUtility',
        file: 'dist/index.global.min.js',
        minify: true
      }
    ]
  },
  {
    input: 'src/index.ts',
    output: { format: 'es', dir: 'dist' },
    plugins: [dts({ tsconfig: './tsconfig.json', emitDtsOnly: true })]
  }
];
