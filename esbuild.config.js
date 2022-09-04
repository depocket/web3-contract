const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['./src/index.ts'],
  //outfile: 'lib/index.js',
  outdir: 'lib',
  bundle: true,
  minify: false,
  platform: 'node',
  sourcemap: false,
  target: 'node14',
  format: 'iife',
  globalName: 'Contract'
}).catch(() => process.exit(1))