/* global describe test expect */
import React from 'react';
import renderer from 'react-test-renderer';
import { FormFile } from '../index';

describe('File component tests', () => {
  test('Renders consistently', () => {
    const component = renderer
      .create(<FormFile name="Upload" required label="contacts" />)
      .toJSON();
    expect.assertions(1);
    expect(component).toMatchSnapshot();
  });
});
