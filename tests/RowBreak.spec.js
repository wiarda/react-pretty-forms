/* global describe test expect */
import React from 'react';
import renderer from 'react-test-renderer';
import { RowBreak } from '../index';

describe('TextArea component tests', () => {
  test('Renders consistently', () => {
    const component = renderer
      .create(<RowBreak styles={{ test: 'margin: auto' }}>This is a child element</RowBreak>)
      .toJSON();
    expect.assertions(1);
    expect(component).toMatchSnapshot();
  });
});
