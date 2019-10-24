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

  // form instance for method tests:
  const form = renderer
    .create(
      <Form
        action="blank"
        loadEvent={instance => {
          instance.loadEvent = 'Loaded';
        }}
        submitEvent={instance => {
          instance.submitEvent = 'Submitted';
        }}
      >
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
          <FormField type="text" name="first" label="First name*" required initialValue="Gortok" />
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
              value: 'test value',
            };
          }
        },
      },
    )
    .getInstance();

  // form instance for method tests (with mocked refs for inputs):
  const form2 = renderer
    .create(
      <Form
        action="blank"
        loadEvent={instance => {
          instance.loadEvent = 'Loaded';
        }}
        submitEvent={instance => {
          instance.submitEvent = 'Submitted';
        }}
      >
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
          <FormField type="text" name="first" label="First name*" required initialValue="Gortok" />
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
              value: 'test value',
            };
          }
          if (element.type === 'input') {
            return {
              value: 'Gortok',
            };
          }
          if (element.type === 'form') {
            return {
              getBoundingClientRect() {
                return 'dimensions';
              },
            };
          }
        },
      },
    )
    .getInstance();

  test('defaultSubmit static method returns a promise', () => {
    const fetchRequest = Form.defaultSubmit('null action', { a: '123' });
    expect(fetchRequest instanceof Promise).toBe(true);
  });

  test('parseParameters static method returns an object with k/v pairs', () => {
    const result = Form.parseParameters();
    expect(result instanceof Object).toBe(true);

    // can't edit global.window.location directly
    global.window.history.pushState({}, null, '/pathname?k=v');

    const result2 = Form.parseParameters();
    expect(result2).toEqual({ k: 'v' });
  });

  test('load event code called', () => {
    expect(form.loadEvent).toBe('Loaded');
  });

  test('form values returned by getInputValues', () => {
    expect(form.getInputValues()).toEqual({});
    expect(form2.getInputValues()).toEqual({
      salutation: 'test value',
      first: 'Gortok',
      last: 'Gortok',
      role: 'Gortok',
      institution: 'Gortok',
      email: 'Gortok',
      checkbox: false,
      source: 'Gortok',
    });
  });

  test('setFormState updates the formState', () => {
    form.setFormState('abc');
    expect(form.state).toEqual({
      formState: 'abc',
    });
  });

  test('getFormBoundingRect returns dimensions', () => {
    expect(form2.getFormBoundingRect()).toBe('dimensions');
  });

  test('saveFormInput saves input to this.initialValues', () => {
    form2.saveFormInput();
    expect(form2.initialValues).toEqual({
      salutation: 'test value',
      first: 'Gortok',
      last: 'Gortok',
      role: 'Gortok',
      institution: 'Gortok',
      email: 'Gortok',
      checkbox: false,
      source: 'Gortok',
    });
  });
});
