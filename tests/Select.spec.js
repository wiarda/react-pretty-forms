/* global describe test expect */
import React from 'react';
import renderer from 'react-test-renderer';
import { FormSelect } from '../index';

describe('Select component', () => {
  test('Matches snapshot', () => {
    const component = renderer
      .create(<FormSelect name="email" />, {
        createNodeMock: element => {
          if (element.type === 'select') {
            return {
              current: {
                value: 'test value',
              },
            };
          }
        },
      })
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders required props', () => {
    const component = renderer
      .create(<FormSelect name="test" label="This is a test field" />, {
        createNodeMock: element => {
          if (element.type === 'select') {
            return {
              current: {
                value: 'test value',
              },
            };
          }
        },
      })
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders required field', () => {
    const component = renderer
      .create(<FormSelect name="test" label="This is a test field" required />, {
        createNodeMock: element => {
          if (element.type === 'select') {
            return {
              current: {
                value: 'test value',
              },
            };
          }
        },
      })
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders without a validation message', () => {
    const component = renderer
      .create(
        <FormSelect name="test" label="This is a test field" validationMessage={false} required />,
        {
          createNodeMock: element => {
            if (element.type === 'select') {
              return {
                current: {
                  value: 'test value',
                },
              };
            }
          },
        },
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts custom styles', () => {
    const component = renderer
      .create(
        <FormSelect
          name="test"
          label="This is a test field"
          className="test-class"
          validationMessage={false}
          required
        />,
        {
          createNodeMock: element => {
            if (element.type === 'select') {
              return {
                current: {
                  value: 'test value',
                },
              };
            }
          },
        },
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts option children', () => {
    const component = renderer
      .create(
        <FormSelect
          name="test"
          label="This is a test field"
          className="test-class"
          validationMessage={false}
          required
        >
          <option value="">-</option>
          <option value="Dr.">Dr.</option>
          <option value="Prof.">Prof.</option>
        </FormSelect>,
        {
          createNodeMock: element => {
            if (element.type === 'select') {
              return {
                current: {
                  value: 'test value',
                },
              };
            }
          },
        },
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Invalid initialValues render as defaultValue', () => {
    const componentInitial = renderer
      .create(
        <FormSelect
          name="test"
          label="This is a test field"
          className="test-class"
          validationMessage={false}
          initialValue="uhoh"
          required
        >
          <option value="">-</option>
          <option value="Dr.">Dr.</option>
          <option value="Prof.">Prof.</option>
        </FormSelect>,
        {
          createNodeMock: element => {
            if (element.type === 'select') {
              return {
                current: {
                  value: 'test value',
                },
              };
            }
          },
        },
      )
      .toJSON();

    const componentDefault = renderer
      .create(
        <FormSelect
          name="test"
          label="This is a test field"
          className="test-class"
          validationMessage={false}
          initialValue="uhoh"
          required
        >
          <option value="">-</option>
          <option value="Dr.">Dr.</option>
          <option value="Prof.">Prof.</option>
        </FormSelect>,
        {
          createNodeMock: element => {
            if (element.type === 'select') {
              return {
                current: {
                  value: 'test value',
                },
              };
            }
          },
        },
      )
      .toJSON();

    expect(componentInitial).toMatchSnapshot();
    expect(componentDefault).toMatchSnapshot();
  });
});
