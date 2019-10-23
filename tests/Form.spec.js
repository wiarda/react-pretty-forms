/* global describe test expect */
import React from 'react';
import renderer from 'react-test-renderer';
import {
  Form,
  FormField,
  FormButton,
  FormCheckbox,
  FormSelect,
  IfResolved,
  IfFailed,
  IfSubmitting,
  IfActive,
} from '../index';

describe('Form component', () => {
  test('Matches snapshot', () => {
    const component = renderer.create(<Form action="blank" />).toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders required props', () => {
    const component = renderer.create(<Form action="blank" />).toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts custom styles', () => {
    const component = renderer
      .create(<Form action="blank" cssModule={{ abc: { fontSize: '1rem' } }} />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders a full form', () => {
    const component = renderer
      .create(
        <Form action="blank">
          <div>plain type</div>
          <IfActive>
            <FormSelect
              required
              name="salutation"
              label="Preferred salutation"
              defaultValue="unselected"
            >
              <option value="">-</option>
              <option value="Dr.">Dr.</option>
              <option value="Prof.">Prof.</option>
            </FormSelect>
            <FormField
              type="text"
              name="first"
              label="First name*"
              required
              initialValue="Gortok"
            />
            <FormField type="text" name="last" label="Last name*" required initialValue="Hamfist" />
            <FormField type="text" name="role" label="Job Title" />
            <FormField type="text" name="institution" label="Institution*" required />
            <FormField type="email" name="email" label="Email*" required />
            <FormCheckbox
              label="Here is a rather long label that might cause some clipping issues"
              required
            />
            <FormField type="hidden" name="source" initialValue="direct" />
            <FormButton type="submit" value="Book a Meeting" />
          </IfActive>
          <IfResolved>Resolved...</IfResolved>
          <IfSubmitting>Loading...</IfSubmitting>
          <IfFailed>Failed...</IfFailed>
        </Form>,
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
});
