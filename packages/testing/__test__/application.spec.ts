import { beforeAll, describe, expect, test } from 'vitest';
import { ApplicationMock, yasumu } from '../src';

describe('Application Mock', () => {
  const app = yasumu.app;

  test('should get name', async () => {
    const name = await app.getName();
    expect(name).toBe('Yasumu');
  });

  test('should get runtime version', async () => {
    const version = await app.getRuntimeVersion();
    expect(version).toBe('1.0.0');
  });

  test('should get version', async () => {
    const version = await app.getVersion();
    expect(version).toBe('1.0.0');
  });
});
