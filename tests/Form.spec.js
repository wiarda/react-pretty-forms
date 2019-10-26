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
  FormStatusWrapper,
} from '../index';

require('whatwg-fetch');


describe('Form component', () => {
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
          <FormField
            type="text"
            name="first"
            label="First name*"
            required
            initialValue="Mickey mouse"
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
        successEvent={instance => {
          instance.successEvent = 'Submitted';
        }}
        failEvent={instance => {
          instance.failEvent = 'Failed';
        }}
        submit={() => Promise.resolve('OVERRIDE')}
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
          <FormField
            type="text"
            name="first"
            label="First name*"
            required
            initialValue="Mickey mouse"
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
        <FormStatusWrapper>
          <div>Items here</div>
        </FormStatusWrapper>
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
              value: 'Mickey mouse',
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
      first: 'Mickey mouse',
      last: 'Mickey mouse',
      role: 'Mickey mouse',
      institution: 'Mickey mouse',
      email: 'Mickey mouse',
      checkbox: false,
      source: 'Mickey mouse',
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
      first: 'Mickey mouse',
      last: 'Mickey mouse',
      role: 'Mickey mouse',
      institution: 'Mickey mouse',
      email: 'Mickey mouse',
      checkbox: false,
      source: 'Mickey mouse',
    });
  });

  const validForm = renderer
    .create(
      <Form
        action="blank"
        successEvent={instance => {
          instance.successEvent = 'Submitted';
        }}
        submit={() => Promise.resolve('abc')}
      >
        <FormField
          type="text"
          name="first"
          label="First name*"
          required
          initialValue="Mickey mouse"
        />
      </Form>,
      {
        createNodeMock: element => {
          if (element.type === 'input') {
            return {
              value: 'Mickey mouse',
            };
          }
          return {};
        },
      },
    )
    .getInstance();

  const validFormOverride = renderer
    .create(
      <Form
        action="blank"
        successEvent={instance => {
          instance.successEvent = 'Submitted';
        }}
        submit={() => Promise.resolve('OVERRIDE')}
      >
        <FormField
          type="text"
          name="first"
          label="First name*"
          required
          initialValue="Mickey mouse"
        />
      </Form>,
      {
        createNodeMock: element => {
          if (element.type === 'input') {
            return {
              value: 'Mickey mouse',
            };
          }
          return {};
        },
      },
    )
    .getInstance();

  test('validateEntries checks ref validations and returns a bool', () => {
    expect(form2.validateEntries()).toBe(false);
    expect(validForm.validateEntries()).toBe(true);
  });

  const mockEvent = {
    preventDefault() {},
  };

  test('submitHandler - on fail handler runs', () => {
    expect(form2.submitHandler(mockEvent)).toBe('Invalid');
    expect(form2.failEvent).toBe('Failed');
  });

  test('submitHandler - on success handler runs', async () => {
    const result = await validForm.submitHandler(mockEvent);
    const resultOverride = await validFormOverride.submitHandler(mockEvent);

    expect.assertions(3);
    expect(result).toBe(undefined);
    expect(validForm.successEvent).toBe('Submitted');
    expect(resultOverride).toBe(undefined);
  });

  const validFormFailedSubmit = renderer
    .create(
      <Form
        action="blank"
        successEvent={instance => {
          instance.successEvent = 'Submitted';
        }}
        failEvent={instance => {
          instance.failEvent = 'Failed';
        }}
        submit={() => Promise.reject('abc')}
      >
        <FormField
          type="text"
          name="first"
          label="First name*"
          required
          initialValue="Mickey mouse"
        />
      </Form>,
      {
        createNodeMock: element => {
          if (element.type === 'input') {
            return {
              value: 'Mickey mouse',
            };
          }
          return {};
        },
      },
    )
    .getInstance();

  test('submitHandler - on submit failure handler runs', async () => {
    const result = await validFormFailedSubmit.submitHandler(mockEvent);

    expect.assertions(2);
    expect(result).toBe(undefined);
    expect(validFormFailedSubmit.failEvent).toBe('Failed');
  });

  test('Form exposes refs to input values', async () => {
    expect.assertions(2);
    expect(validForm.exposeRefs().hasOwnProperty('first')).toBe(true);
    expect(validForm.exposeRef('first')).toEqual({ value: 'Mickey mouse' });
  });
});
