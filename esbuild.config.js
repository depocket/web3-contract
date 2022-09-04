const esbuild = require('esbuild')
const plugin = require('node-stdlib-browser/helpers/esbuild/plugin');
const stdLibBrowser = require('node-stdlib-browser');

esbuild.build({
  entryPoints: ['./src/index.ts'],
  //outfile: 'lib/index.js',
  outdir: 'lib',
  bundle: true,
  minify: false,
  platform: 'node',
  sourcemap: false,
  format: 'iife',
  inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
  define: {
    global: 'global',
    process: 'process',
    Buffer: 'Buffer'
  },
  plugins: [plugin(stdLibBrowser)],
  globalName: 'Contract'
}).catch(() => process.exit(1))