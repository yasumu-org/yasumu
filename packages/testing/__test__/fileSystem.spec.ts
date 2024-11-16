import { yasumu } from '../src';
import { describe, test, expect, beforeAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';

const testFilePath = path.join(__dirname, 'testFile.txt');

describe('FileSystem', () => {
  beforeAll(async () => {
    await fs.writeFile(testFilePath, 'Initial content for testing');
  });

  test('should have a lstat method', async () => {
    const result = await yasumu.fs.lstat(testFilePath);
    expect(result).toBeDefined();
    expect(result.isDirectory).toBe(false);
    expect(result.isFile).toBe(true);
    expect(result.isSymlink).toBe(false);
    expect(result.size).toBe(27);
  });

  test('should have a copyFile method', () => {
    const copyPath = path.join(__dirname, 'copyFile.txt');
    yasumu.fs.copyFile(testFilePath, copyPath);
    expect(fs.readFile(copyPath, { encoding: 'utf-8' })).resolves.toBe('Initial content for testing');
    yasumu.fs.remove(copyPath);
  });

  test('should have an exists method', () => {
    expect(yasumu.fs.exists(testFilePath)).resolves.toBe(true);
  });

  test('should have a mkdir method', () => {
    expect(yasumu.fs.mkdir).toBeDefined();
  });

  test('should have a readDir method', () => {
    expect(yasumu.fs.readDir).toBeDefined();
  });

  test('should have a readFile method', async () => {
    const result = await yasumu.fs.readFile(testFilePath);
    expect(result).toBe('Initial content for testing');
  });

  test('should have a remove method', async () => {
    yasumu.fs.remove(testFilePath);
    const result = await yasumu.fs.exists(testFilePath);
    expect(result).toBe(false);
  });

  test('should have a writeFile method', () => {
    expect(yasumu.fs.writeFile).toBeDefined();
  });

  test('should have a watch method', () => {
    expect(yasumu.fs.watch).toBeDefined();
  });
});
