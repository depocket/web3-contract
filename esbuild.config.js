const esbuild = require('esbuild')

// Automatically exclude all node_modules from the bundled version
//const { nodeExternalsPlugin } = require('esbuild-node-externals')

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
  //plugins: [nodeExternalsPlugin()]
}).catch(() => process.exit(1))