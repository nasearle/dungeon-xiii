import * as esbuild from 'esbuild';

const config = {
  bundle: true,
  target: "es2020",
  format: "esm",
  entryPoints: [
    "./dev/index.js",
    "./dev/style.css"
  ],
  outdir: 'out',
};

// This watch config adheres to the conventions of the esbuild-problem-matchers
// extension
// (https://github.com/connor4312/esbuild-problem-matchers#esbuild-via-js)
/** @type BuildOptions */
const errorMatcherPlugin = {
  name: "error-matcher-plugin",
  setup(build) {
    build.onStart(() => {
      console.log("[watch] build started");
    });
    build.onEnd(result => {
      if (result.errors.length) {
        result.errors.forEach(error =>
          console.error(
            `> ${error.location.file}:${error.location.line}:` +
            `${error.location.column}: error: ${error.text}`
          )
        );
      }
    });
  }
};

const watchConfig = {
  plugins: [errorMatcherPlugin]
};

(async () => {
  const args = process.argv.slice(2);
  try {
    if (args.includes("--watch")) {
      console.log("[watch] start build");
      const context = await esbuild.context({
        ...config,
        ...watchConfig,
      });
      await context.watch();
      console.log('[watch] watching...');
    } else {
      await esbuild.build(config);
      console.log("build complete");
    }
  } catch (err) {
    process.stderr.write(err.stderr);
    process.exit(1);
  }
})();