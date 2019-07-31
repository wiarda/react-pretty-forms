/* global describe test expect */
import React from 'react';
import renderer from 'react-test-renderer';
import { FormNumber } from '../index';

describe('Number component', () => {
  test('Matches snapshot', () => {
    const component = renderer.create(<FormNumber name="pets" />).toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders required props', () => {
    const component = renderer
      .create(<FormNumber name="test" label="This is a test field" />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders required field', () => {
    const component = renderer
      .create(<FormNumber name="test" label="This is a test field" required />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders without a validation message', () => {
    const component = renderer
      .create(
        <FormNumber name="test" label="This is a test field" validationMessage={false} required />,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts custom styles', () => {
    const component = renderer
      .create(
        <FormNumber
          name="test"
          label="This is a test field"
          className="test-class"
          validationMessage={false}
          required
        />,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts min and max props', () => {
    const component = renderer
      .create(
        <FormNumber
          name="test"
          label="This is a test field"
          className="test-class"
          validationMessage={false}
          required
          min={1}
          max={10}
        />,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts intitial value', () => {
    const component = renderer
      .create(
        <FormNumber
          name="test"
          label="This is a test field"
          className="test-class"
          validationMessage={false}
          required
          min={1}
          max={10}
          intialValue={7}
        />,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });
});
