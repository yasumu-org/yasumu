/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommandCommon, YasumuBootstrapOptions } from '@yasumu/core';
import memfs from 'memfs';
import { createVolume } from 'memfs/lib/volume-localstorage';
import path from 'path-browserify';

export function WebAdapter(): YasumuBootstrapOptions {
  console.log('Loading WebAdapter');

  const fs =
    typeof localStorage !== 'undefined' ? memfs.createFsFromVolume(new (createVolume('yasumu-fs'))()) : memfs.fs;

  return {
    adapters: {
      app: {
        async getName() {
          return 'Yasumu';
        },
        async getRuntimeVersion() {
          return '0.0.1-web';
        },
        async getVersion() {
          return '0.0.1-web';
        },
      },
      command: {
        // eslint-disable-next-line
        async addPluginListener(plugin: unknown, event: unknown, cb: unknown) {},
        // eslint-disable-next-line
        async invoke(command: unknown, args: unknown, options: unknown) {},
      } as unknown as CommandCommon,
      store: {
        async delete(key) {
          localStorage.removeItem(key);
          return true;
        },
        async entries() {
          return Object.entries(localStorage) as any;
        },
        async get(key) {
          return localStorage.getItem(key) as any;
        },
        async has(key) {
          return localStorage.getItem(key) !== null;
        },
        async keys() {
          return Object.keys(localStorage);
        },
        async length() {
          return localStorage.length;
        },
        async load() {
          //
        },
        // eslint-disable-next-line
        async onChange(cb) {
          //
          return () => {};
        },
        // eslint-disable-next-line
        async onKeyChange(key, cb) {
          //
          return () => {};
        },
        async reset() {
          localStorage.clear();
        },
        async save() {
          //
        },
        async set(key, value) {
          localStorage.setItem(key, value as string);
        },
        async values() {
          return Object.values(localStorage);
        },
      },
      dialog: {
        async open(options) {
          void options;
          return null;
        },
        async save(options) {
          void options;
          return null;
        },
      },
      events: {} as any,
      fs: {
        async copyFile(fromPath, toPath) {
          fs.copyFileSync(fromPath, toPath);
        },
        async exists(path) {
          return fs.existsSync(path);
        },
        async lstat(path) {
          const result = fs.lstatSync(path);
          return {
            isDirectory: result.isDirectory(),
            isFile: result.isFile(),
            isSymlink: result.isSymbolicLink(),
            size: result.size,
          };
        },
        async mkdir(path, options) {
          fs.mkdirSync(path, options);
        },
        async readDir(path) {
          const res = fs.readdirSync(path, { withFileTypes: true });

          return res.map((r: any) => {
            return {
              isDirectory: r.isDirectory(),
              isFile: r.isFile(),
              isSymlink: r.isSymbolicLink(),
              name: r.name,
            };
          });
        },
        async readFile(path) {
          return fs.readFileSync(path, { encoding: 'buffer' }) as Uint8Array;
        },
        async readTextFile(path) {
          return fs.readFileSync(path, { encoding: 'utf8' }) as string;
        },
        async remove(path, options) {
          fs.rmSync(path, options);
        },
        async rename(oldPath, newPath) {
          fs.renameSync(oldPath, newPath);
        },
        async watch(paths: any, callback: any, options) {
          const watcher = fs.watch(paths, options, (event, filename) => {
            callback(event, filename);
          });

          return () => watcher.close();
        },
        async watchImmediate(paths: any, callback: any, options) {
          const watcher = fs.watch(paths, options, (event, filename) => {
            callback(event, filename);
          });

          return () => watcher.close();
        },
        async writeFile(path, data, options) {
          void options;
          fs.writeFileSync(path, data, { encoding: 'buffer' });
        },
        async writeTextFile(path, data, options) {
          void options;
          fs.writeFileSync(path, data, { encoding: 'utf-8' });
        },
      },
      path: path as any,
      process: {
        async exit(code) {
          void code;
          try {
            window.close();
          } catch {}
        },
        async relaunch() {
          window.location.reload();
        },
      },
      shell: {
        async open(path, openWith) {
          void openWith;
          window.open(path);
        },
      },
      fetch,
    },
  };
}
