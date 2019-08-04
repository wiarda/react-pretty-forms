/* global describe test expect */
import React from 'react';
import renderer from 'react-test-renderer';
import { FormButton } from '../index';

describe('Button component', () => {
  test('Matches snapshot', () => {
    const component = renderer.create(<FormButton />).toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders required props', () => {
    const component = renderer.create(<FormButton type="button" value="Register" />).toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts custom submit handler', () => {
    const component = renderer
      .create(
        <FormButton type="button" value="Register" submitHandler={() => Promise.resolve('ok')} />,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts custom styles', () => {
    const component = renderer
      .create(<FormButton type="button" value="Register" className="test-class" />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts data props', () => {
    const component = renderer
      .create(<FormButton type="button" value="Register" className="test-class" data-test="test" />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });
});
