/* global describe test expect */
import React from 'react';
import renderer from 'react-test-renderer';
import { FormCheckbox } from '../index';

describe('Checkbox component', () => {
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
      .create(<FormCheckbox value="Register" className="test-class" />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts data props', () => {
    const component = renderer
      .create(<FormCheckbox value="Register" className="test-class" data-test="test" />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('getValue method correctly reads checked value', () => {
    const props = {
      value: 'Register',
      className: 'test-class',
      checked: true,
    };

    const checked = renderer
      .create(<FormCheckbox {...props} />, {
        createNodeMock: element => {
          if (element.type === 'input') {
            // mock ref
            return {
              checked: true,
              value: 'Register',
            };
          }
        },
      })
      .getInstance();

    const unchecked = renderer
      .create(<FormCheckbox {...props} />, {
        createNodeMock: element => {
          if (element.type === 'input') {
            // mock ref
            return {
              checked: false,
              value: 'Register',
            };
          }
        },
      })
      .getInstance();

    expect(checked.getValue()).toBe('Register');
    expect(unchecked.getValue()).toBe(false);
  });

  test('default validator returns expected values', () => {
    const props = {
      value: 'Register',
      className: 'test-class',
      checked: true,
    };

    const required = renderer.create(<FormCheckbox {...props} required />).getInstance();
    const unrequired = renderer.create(<FormCheckbox {...props} />).getInstance();

    expect(required.defaultValidator('value input')).toBe(true);
    expect(required.defaultValidator()).toBe(false);
    expect(unrequired.defaultValidator('value input')).toBe(true);
    expect(unrequired.defaultValidator()).toBe(true);
  });
});
