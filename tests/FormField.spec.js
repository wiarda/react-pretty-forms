/* global describe test expect */
import React from 'react';
import renderer from 'react-test-renderer';
import { FormField } from '../index';

describe('Field component', () => {
  test('Matches snapshot', () => {
    const component = renderer.create(<FormField name="email" />).toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders required props', () => {
    const component = renderer
      .create(<FormField name="test" label="This is a test field" />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders required field', () => {
    const component = renderer
      .create(<FormField name="test" label="This is a test field" required />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders without a validation message', () => {
    const component = renderer
      .create(
        <FormField name="test" label="This is a test field" validationMessage={false} required />,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts custom styles', () => {
    const component = renderer
      .create(
        <FormField name="test" label="This is a test field" className="test-class" validationMessage={false} required />,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });
});
