import { defineConfig, Options } from 'tsup';
import { esbuildPluginUseMacro } from 'use-macro';

type TsupConfig = {
  entry: string[];
};

export const createTsupConfig = (options: TsupConfig) =>
  defineConfig({
    banner: {
      js: `// Copyright (c) ${new Date().getFullYear()} Yasumu authors`,
    },
    dts: true,
    clean: true,
    sourcemap: true,
    format: ['cjs', 'esm'],
    keepNames: true,
    minify: false,
    esbuildPlugins: [esbuildPluginUseMacro()],
    entry: options.entry,
    target: 'es2020',
    skipNodeModulesBundle: true,
    silent: true,
  });
