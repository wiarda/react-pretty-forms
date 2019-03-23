/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

// import Loader from './Loader';
// import FormField from './FormField';
import FormFieldFile from './FormFieldFile';
import FormFieldPretty from './FormFieldPretty';
import FormButton from './FormButton';
import FormSelectPretty from './FormSelectPretty';
import FormCheckbox from './FormCheckbox';
// import Retry from './FormRetry';

// const INPUT_TYPES = [FormField, FormFieldFile, FormFieldPretty, FormSelectPretty, FormCheckbox];
const INPUT_TYPES = [FormFieldFile, FormFieldPretty, FormSelectPretty, FormCheckbox];

/**
 * formId = the form id used by the db
 * title = the form's title text
 * action = api endpoint to submit form
 * accepts url parameters to prefill form, as well as a source parameter
 * to track link sources
 */
export default function Form({ children, ...props }) {
  const inputRefs = useRef({});
  const fieldNames = useRef([]);
  const formElements = useRef([]);

  useEffect(() => {
    // generate refs for input fields
    console.log('Generating input refs');
    children.forEach(child => {
      if (INPUT_TYPES.includes(child.type)) {
        const fieldName = child.props && child.props.name;
        inputRefs[fieldName] = React.createRef();
        fieldNames.push(fieldName);
      }
    });

    // add parameters
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
    formElements = React.Children.map(children, child => {
      const childProps = {};
      const fieldName = child.props && child.props.name;

      // add refs and initial values to inputs
      if (INPUT_TYPES.includes(child.type)) {
        childProps.initialValue = initialValues[fieldName] || child.props.initialValue;
        childProps.ref = inputRefs[fieldName];
      }

      // add submit handler to submit button
      if (child.type === FormButton) {
        childProps.submitHandler = submitHandler;
        // childProps.submitHandler = testRedirect;
      }

      return React.cloneElement(child, { ...childProps });
    });
  }, [children].length);

  // initiate form state
  const { formState, setFormState } = useState('active');

  const getInputValues = () => {
    const currentValues = {};
    fieldNames.forEach(fieldName => {
      currentValues[fieldName] = inputRefs[fieldName].current.getValue();
    });
    return currentValues;
  };

  const validateEntries = () => {
    // check validity of inputs and return true if all pass
    return Object.values(inputRefs).reduce((acc, curr) => {
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
    fieldNames.forEach(fieldName => {
      formValues[fieldName] = inputRefs[fieldName].current.getValue();
    });

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
          <Loader spinner>Registering</Loader>
        </div>
        <div className="form--resolved-text" data-formstate={formState}>
          {thankyouMessage}
        </div>
        <div className="form--failed-text" data-formstate={formState}>
          <Retry submitHandler={submitHandler} formState={formState} />
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
