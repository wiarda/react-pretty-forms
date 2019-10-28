/* global describe test expect */
import React from 'react';
import renderer from 'react-test-renderer';
import { TextArea } from '../index';

describe('TextArea component tests', () => {
  test('Renders consistently', () => {
    const component = renderer.create(<TextArea name="Long" required label="Essay" />).toJSON();
    expect.assertions(1);
    expect(component).toMatchSnapshot();
  });
});
