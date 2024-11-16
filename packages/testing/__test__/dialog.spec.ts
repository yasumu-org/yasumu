import { yasumu } from '../src';
import { describe, test, expect } from 'vitest';

describe('Dialog', () => {
  const dialog = yasumu.dialog;

  test('should open a dialog', async () => {
    const result = await dialog.open({
      title: 'Test',
    });
    expect(result).toBe(null);
  });

  test('should save a dialog', async () => {
    const result = await dialog.save({
      title: 'Test',
    });
    expect(result).toBe(null);
  });
  
});
