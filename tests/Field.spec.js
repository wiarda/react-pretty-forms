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
        <FormField
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

  test('Accepts initial value', () => {
    const component = renderer
      .create(
        <FormField
          name="test"
          label="This is a test field"
          className="test-class"
          validationMessage={false}
          required
          initialValue="start off with this"
        />,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  const component = renderer
    .create(
      <FormField
        name="test"
        label="test"
        className="test-class"
        validationMessage="A custom validation message"
        validator={() => false}
        required
      />,
      {
        createNodeMock: element => {
          if (element.type === 'input') {
            return {
              value: 'I have a value',
            };
          }
          return {};
        },
      },
    )
    .getInstance();

  test('Click handler resets field state', () => {
    component.clickHandler();
    expect.assertions(1);
    expect(component.state).toEqual({
      labelUp: true,
      isValid: true,
      validationMessage: 'A custom validation message',
    });
  });

  test('If specified, getValidationMessage returns custom message', () => {
    expect.assertions(1);
    expect(component.getValidationMessage()).toBe('A custom validation message');
  });

  test('If specified, deriveValidityState uses custom validator', () => {
    expect.assertions(1);
    expect(component.deriveValidityState()).toBe(false);
  });

  test('blurHandler correctly sets state', () => {
    component.blurHandler();
    expect.assertions(1);
    expect(component.state).toEqual({
      labelUp: true,
      isValid: false,
      validationMessage: 'A custom validation message',
    });
  });

  test('blurHandler aborts on mobile blur', () => {
    const mobileBlurComponent = renderer
      .create(<FormField mobileBlur={false} name="test" label="test" />)
      .getInstance();
    mobileBlurComponent.isMobile = true;
    expect.assertions(1);
    expect(mobileBlurComponent.blurHandler()).toBe(undefined);
  });

  test('focusHandler sets label up', () => {
    expect.assertions(1);
    component.focusHandler();
    expect(component.state).toEqual({
      labelUp: true,
      isValid: true,
      validationMessage: 'A custom validation message',
    });
  });
});
