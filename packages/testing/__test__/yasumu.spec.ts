import { describe, test, expect } from 'vitest';
import { yasumu } from '../src/index';
import { Yasumu } from '@yasumu/core';

describe('Yasumu', () => {
  test('should be Yasumu instance', () => {
    expect(yasumu).toBeInstanceOf(Yasumu);
    
  });
});
