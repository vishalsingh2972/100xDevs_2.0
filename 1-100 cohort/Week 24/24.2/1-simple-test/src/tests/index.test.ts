//or index.spec.ts

import { describe, test, expect, it} from '@jest/globals';
import { sum, multiply } from '../index';

describe('testing sum function', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  //'it' also works
  it('should return the sum of negative numbers correctly', () => {
    expect(sum(-1, -2)).toBe(-3);
  });
});

describe('testing multiply function', () => {
  test('should work correctly on basic multiplication', () => {
    expect(multiply(2, 3)).toBe(6);
  });
});