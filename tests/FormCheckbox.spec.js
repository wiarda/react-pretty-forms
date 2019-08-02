/* global describe test expect */
import React from 'react';
import renderer from 'react-test-renderer';
import { FormCheckbox } from '../index';

describe('Button component', () => {
  test('Matches snapshot', () => {
    const component = renderer.create(<FormCheckbox />).toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders required props', () => {
    const component = renderer.create(<FormCheckbox name="Subscribe" />).toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts custom styles', () => {
    const component = renderer
      .create(<FormCheckbox type="button" value="Register" className="test-class" />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts data props', () => {
    const component = renderer
      .create(<FormCheckbox type="button" value="Register" className="test-class" data-test="test" />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });
});
