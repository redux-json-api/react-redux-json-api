/* @flow strict */
import something from '../something';

it('does not return anything', () => {
  expect(something(1)).toBe();
});
