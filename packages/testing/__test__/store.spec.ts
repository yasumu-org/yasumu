import { yasumu } from '../src';
import { describe, test, expect } from 'vitest';

describe('Store', () => {
  test('should set and get value', async () => {
    const store = yasumu.store;
    await store.set('key', 'value');
    const value = await store.get('key');
    expect(value).toBe('value');
    await store.delete('key');
  });

  test('should get all entries', async () => {
    const newStore = yasumu.store;
    await newStore.set('key1', 'value1');
    await newStore.set('key2', 'value2');
    const entries = await newStore.entries();
    expect(entries).toEqual([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]);
  });

  test('should get all keys', async () => {
    const store = yasumu.store;
    await store.set('key1', 'value1');
    await store.set('key2', 'value2');
    const keys = await store.keys();
    expect(keys).toEqual(['key1', 'key2']);
  });

  test('should get all values', async () => {
    const store = yasumu.store;
    await store.set('key1', 'value1');
    await store.set('key2', 'value2');
    const values = await store.values();
    expect(values).toEqual(['value1', 'value2']);
  });

  test('should get length', async () => {
    const store = yasumu.store;
    await store.set('key1', 'value1');
    await store.set('key2', 'value2');
    const length = await store.length();
    expect(length).toBe(2);
  });

  test('should reset store', async () => {
    const store = yasumu.store;
    await store.set('key1', 'value1');
    await store.set('key2', 'value2');
    await store.reset();
    const length = await store.length();
    expect(length).toBe(0);
  });

  test('should check if key exists', async () => {
    const store = yasumu.store;
    await store.set('key', 'value');
    const exists = await store.has('key');
    expect(exists).toBe(true);
  });

  test('should delete value', async () => {
    const store = yasumu.store;
    await store.set('key', 'value');
    await store.delete('key');
    const value = await store.get('key');
    expect(value).toBeUndefined();
  });
});
