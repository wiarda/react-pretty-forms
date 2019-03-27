/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// import Loader from './Loader';
import FormField from './FormField';
import FormFieldFile from './FormFieldFile';
import FormFieldPretty from './FormFieldPretty';
import FormButton from './FormButton';
import FormSelectPretty from './FormSelectPretty';
import FormCheckbox from './FormCheckbox';
// import Retry from './FormRetry';

// const INPUT_TYPES = [FormField, FormFieldFile, FormFieldPretty, FormSelectPretty, FormCheckbox];
const INPUT_TYPES = [
  FormFieldFile.toString(),
  FormFieldPretty.toString(),
  FormSelectPretty.toString(),
  FormCheckbox.toString(),
];

/**
 * accepts url parameters to prefill form
 * action: api endpoint to submit form
 * to track link sources
 */
export default function Form({ children, ...props }) {
  const inputRefs = useRef({});
  const fieldNames = useRef([]);
  const [formState, setFormState] = useState('active');
  const [formElements, setFormElements] = useState(null);

  useEffect(() => {
    // generate refs for input fields
    children.forEach(child => {
      if (INPUT_TYPES.includes(child.type.toString())) {
        const fieldName = child.props && child.props.name;
        inputRefs.current[fieldName] = React.createRef();
        fieldNames.current.push(fieldName);
      }
    });
    console.log('Generating input refs:', inputRefs);

    // prefill query parameters
    const parseParameters = () => {
      if (typeof window !== 'undefined') {
        const rawParams = window.location.search.slice(1);
        const params = new URLSearchParams(rawParams);
        const initialValues = {};

        for (let param of params) {
          const [name, value] = param;
          initialValues[name] = value;
        }

        return initialValues;
      }
      return {};
    };

    console.log('Attaching initial values and input refs');
    const initialValues = parseParameters();
    console.log('initial values:', initialValues);
    const formElements = React.Children.map(children, child => {
      const childProps = {};
      const fieldName = child.props && child.props.name;

      console.log('child.type:', child.type.prototype);
      console.log(child instanceof FormFieldPretty);
      console.log(child.type.prototype instanceof FormFieldPretty);
      // add refs and initial values to inputs
      if (INPUT_TYPES.includes(child.type.toString())) {
        console.log(
          'attaching ref and initial to a field:',
          fieldName,
          inputRefs.current[fieldName],
          initialValues[fieldName]
        );
        childProps.initialValue = initialValues[fieldName] || child.props.initialValue;
        childProps.ref = inputRefs.current[fieldName];
      }

      // add submit handler to submit button
      if (child.type.toString() === FormButton.toString()) {
        childProps.submitHandler = submitHandler;
        // childProps.submitHandler = testRedirect;
      }

      return React.cloneElement(child, { ...childProps });
    });
    console.log(formElements);
    setFormElements(formElements);
  }, [children].length);

  const getInputValues = () => {
    const currentValues = {};
    fieldNames.current.forEach(fieldName => {
      currentValues[fieldName] = inputRefs.current[fieldName].current.getValue();
    });
    return currentValues;
  };

  const validateEntries = () => {
    // check validity of inputs and return true if all pass
    return Object.values(inputRefs.current).reduce((acc, curr) => {
      const currentValidation = curr.current.validate();
      return acc && currentValidation;
    }, true);
  };

  const defaultSubmit = (action, formValues) => {
    console.log('default submit');
    return fetch(action, {
      method: 'POST',
      body: JSON.stringify(formValues),
    });
  };

  const submitHandler = e => {
    e.preventDefault();
    console.log('form submit handler');

    // check for validity
    const isFormValid = validateEntries();
    if (!isFormValid) return;

    // gather form values for submission
    const formValues = {};
    fieldNames.current.forEach(fieldName => {
      formValues[fieldName] = inputRefs.current[fieldName].current.getValue();
    });

    console.log(formValues);

    // check for custom submit
    const submit = props.submit || defaultSubmit;

    // submit
    const { action } = props;
    submit(action, formValues)
      .then(result => {
        // console.log(result);
        setFormState('resolved');
      })
      .catch(err => {
        console.error(err);
        setFormState('failed');
      });
    setFormState('loading');
  };

  const testRedirect = () => {
    console.log('testing redirect');
    setFormState('resolved');
  };

  //   componentDidMount() {
  //     const { action, wakeup } = props;

  //     // wake submission endpoint
  //     if (wakeup) {
  //       console.log('Form mounted, waking up submission endpoint:', action);
  //       fetch(action, { method: 'POST' })
  //         .then(result => console.log(result))
  //         .catch(err => console.log('Endpoint unreachable.'));
  //     }
  //   }

  //   componentDidUpdate() {
  //
  //     if (formState === 'resolved') {
  //       // redirect to the webinar recording

  //     }
  //   }

  const { action, thankyouMessage, className, encType, multiple } = props;

  return (
    <a name="form">
      <form
        className={`${className} registration--form`}
        action={action}
        method="post"
        data-formstate={formState}
        onChange={getInputValues}
        encType={encType}
      >
        <div className="form--loading-text" data-formstate={formState}>
          {/* <Loader spinner>Registering</Loader> */}
        </div>
        <div className="form--resolved-text" data-formstate={formState}>
          {/* {thankyouMessage} */}
        </div>
        <div className="form--failed-text" data-formstate={formState}>
          {/* <Retry submitHandler={submitHandler} formState={formState} /> */}
        </div>

        {formElements}
      </form>
    </a>
  );
}

Form.propTypes = {
  action: PropTypes.string.isRequired,
  thankyouMessage: PropTypes.element.isRequired,
  className: PropTypes.string,
  submit: PropTypes.func,
  encType: PropTypes.string,
  wakeup: PropTypes.bool.isRequired,
  toggleRegistration: PropTypes.func,
};

Form.defaultProps = {
  thankyouMessage: <span>Thank you for registering!</span>,
  className: '',
  encType: '',
  wakeup: false,
};
