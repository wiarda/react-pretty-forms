/**
 * @jest-environment node
 */
/* global describe test expect */

import { Form } from '../index';

describe('Will run in node environments', () => {
  test("Doesn't attempt to parse url query params in non-browser environments", () => {
    expect.assertions(1);
    expect(Form.parseParameters()).toEqual({});
  });
});
