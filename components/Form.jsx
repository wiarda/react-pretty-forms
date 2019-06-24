/* eslint-disable */
const React = require('react');
const PropTypes = require('prop-types');

// import FormField from './FormField';
const FormFieldFile = require('./FormFieldFile');
const FormFieldPretty = require('./FormFieldPretty');
const FormButton = require('./FormButton');
const FormSelectPretty = require('./FormSelectPretty');
const FormCheckbox = require('./FormCheckbox');
const Loader = require('./Loader');
const Retry = require('./Retry');

const INPUT_TYPES = [FormFieldFile, FormFieldPretty, FormSelectPretty, FormCheckbox];

/**
 * title = the form's title text
 * action = api endpoint to submit form
 * accepts url parameters to prefill form, as well as a source parameter
 * to track link sources
 */
class Form extends React.PureComponent {
  constructor(props) {
    super(props);

    // methods
    this.submitHandler = this.submitHandler.bind(this);
    this.defaultSubmit = this.defaultSubmit.bind(this);
    this.validateEntries = this.validateEntries.bind(this);
    this.getInputValues = this.getInputValues.bind(this);
    this.cloneChildren = this.cloneChildren.bind(this);

    // generate refs for input fields
    this.inputRefs = {};
    this.fieldNames = [];

    props.children.forEach(child => {
      if (INPUT_TYPES.includes(child.type)) {
        const fieldName = child.props && child.props.name;
        this.inputRefs[fieldName] = React.createRef();
        this.fieldNames.push(fieldName);
      }
    });

    // parse uri parameters
    this.initialValues = parseParameters();

    // generate Form Components
    this.FormElements = this.cloneChildren();

    // initiate form state
    this.state = { formState: 'active' };
  }

  getInputValues() {
    const currentValues = {};
    this.fieldNames.forEach(fieldName => {
      currentValues[fieldName] = this.inputRefs[fieldName].current.getValue();
    });
    return currentValues;
  }

  cloneChildren() {
    const { children, styles } = this.props;

    return React.Children.map(children, child => {
      const childProps = {};
      const fieldName = child.props && child.props.name;

      // add refs and initial values to inputs
      if (INPUT_TYPES.includes(child.type)) {
        childProps.initialValue = this.initialValues[fieldName] || child.props.initialValue;
        childProps.ref = this.inputRefs[fieldName];
      }

      // add submit handler to submit button
      if (child.type === FormButton) {
        childProps.submitHandler = this.submitHandler;
      }

      // pass on CSS module
      childProps.styles = styles;

      return React.cloneElement(child, { ...childProps });
    });
  }

  validateEntries() {
    // check validity of inputs and return true if all pass
    return Object.values(this.inputRefs).reduce((acc, curr) => {
      const currentValidation = curr.current.validate();
      return acc && currentValidation;
    }, true);
  }

  defaultSubmit(action, formValues) {
    console.log('default submit');
    return fetch(action, {
      method: 'POST',
      body: JSON.stringify(formValues),
    });
  }

  submitHandler(e) {
    e.preventDefault();
    console.log('form submit handler');

    // check for validity
    const isFormValid = this.validateEntries();
    if (!isFormValid) return;

    // gather form values for submission
    const formValues = {};
    this.fieldNames.forEach(fieldName => {
      formValues[fieldName] = this.inputRefs[fieldName].current.getValue();
    });

    // pass cookies as a form value b/c firebase functions strips all cookies besides __session
    formValues.cookie = document.cookie;

    // check for custom submit
    const submit = this.props.submit || this.defaultSubmit;

    // submit
    const { action } = this.props;
    submit(action, formValues)
      .then(result => {
        // console.log(result);
        this.setState({ formState: 'resolved' });
      })
      .catch(err => {
        console.error(err);
        this.setState({ formState: 'failed' });
      });
    this.setState({ formState: 'loading' });
  }

  componentDidMount() {
    const { wakeup, action } = this.props;

    // wake submission endpoint
    if (wakeup) {
      // remove replace silent / notify with wake
      fetch(`${action.slice(0, -6)}wakeup`, { method: 'POST' })
        .then(result => console.log('Endpoint woken'))
        .catch(err => console.log('Endpoint unreachable.'));
    }
  }

  componentDidUpdate() {
    const { formState } = this.state;
    if (formState === 'resolved') {
      // redirect to the webinar recording
    }
  }

  render() {
    const { action, thankyouMessage, className, encType, multiple, styles = {} } = this.props;
    const { formState } = this.state;

    return (
      <a name="form">
        <form
          className={styles.form || `${className} registration--form`}
          action={action}
          method="post"
          data-formstate={formState}
          onChange={this.getInputValues}
          encType={encType}
        >
          <div
            className={styles.formLoadingText || 'form--loading-text'}
            data-formstate={formState}
          >
            <Loader spinner>Registering</Loader>
          </div>
          <div
            className={styles.formResolvedText || 'form--resolved-text'}
            data-formstate={formState}
          >
            {thankyouMessage}
          </div>
          <div className={styles.formFailedText || 'form--failed-text'} data-formstate={formState}>
            <Retry submitHandler={this.submitHandler} formState={formState} />
          </div>

          {this.FormElements}
        </form>
      </a>
    );
  }
}

function parseParameters() {
  if (typeof window !== 'undefined') {
    try {
      const rawParams = window.location.search.slice(1);
      const params = new URLSearchParams(rawParams);
      const initialValues = {};

      for (let param of params) {
        const [name, value] = param;
        initialValues[name] = value;
      }

      return initialValues;
    } catch (err) {
      console.log('Search parameters not supported in this browser version.')
    }
  }
  return {};
}

Form.propTypes = {
  action: PropTypes.string.isRequired,
  thankyouMessage: PropTypes.element.isRequired,
  className: PropTypes.string,
  submit: PropTypes.func,
  encType: PropTypes.string,
  wakeup: PropTypes.bool,
  toggleRegistration: PropTypes.func,
  styles: PropTypes.object,
};

Form.defaultProps = {
  thankyouMessage: <span>Thank you!</span>,
  className: '',
  encType: '',
};

module.exports = Form;