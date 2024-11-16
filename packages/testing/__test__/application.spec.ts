import { beforeAll, describe, expect, test } from 'vitest';
import { ApplicationMock } from '../src';
import { yasumu } from '../src/index';

describe('Application Mock', () => {
  let app;
  beforeAll(() => {
    app = new ApplicationMock();
  });
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
