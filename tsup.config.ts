import type { Options } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';

const env = process.env.NODE_ENV;

export const tsup: Options = {
  clean: true, // clean up the dist folder
  format: ['esm'],
  minify: env === 'production',
  watch: env === 'development',
  outDir: 'dist',
  entry: ['src/integration/index.js'],
  outExtension() {
    return {
      js: `.js`,
    };
  },
  esbuildPlugins: [sassPlugin()],
  loader: {
    '.js': 'jsx',
  },
  target: 'es2020',
  platform: 'browser',
};
