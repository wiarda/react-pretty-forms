/* eslint-disable */
const React = require('react');
const PropTypes = require('prop-types');

const FormFieldFile = require('./FormFieldFile');
const FormFieldPretty = require('./FormFieldPretty');
const FormButton = require('./FormButton');
const FormSelectPretty = require('./FormSelectPretty');
const FormCheckbox = require('./FormCheckbox');
const FormStatusWrapper = require('./FormStateWrapper');

const OnResolved = require('./OnResolved');
const OnFailed = require('./OnFailed');
const OnSubmitting = require('./OnSubmitting');
const OnActive = require('./OnActive');

const INPUT_TYPES = [FormFieldFile, FormFieldPretty, FormSelectPretty, FormCheckbox];
const FORM_STATE_COMPONENTS = [FormStatusWrapper, OnResolved, OnFailed, OnSubmitting, OnActive]

// ToDo: Standardize form states and include as a data prop on the form to enable easier CSS styling off it
// include cookies in form as a setting


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
    this.processChildren = this.processChildren.bind(this);
    this.generateRefs = this.generateRefs.bind(this);

    // initiate form state
    this.state = { formState: 'active' };

    // parse parameter values
    this.initialValues = parseParameters();

    // generate refs for input fields
    this.inputRefs = {};
    this.fieldNames = [];
    React.Children.forEach(props.children, this.generateRefs);
  }

  getInputValues() {
    const currentValues = {};
    this.fieldNames.forEach(fieldName => {
      currentValues[fieldName] = this.inputRefs[fieldName].current.getValue();
    });
    return currentValues;
  }

  generateRefs(child) {
    if (INPUT_TYPES.includes(child.type)) {
      const fieldName = child.props && child.props.name;
      this.inputRefs[fieldName] = React.createRef();
      this.fieldNames.push(fieldName);
    }
    if (child.type === OnActive) {
      React.Children.forEach(child.props.children, this.generateRefs)
    }
  }

  cloneChildren() {
    const { children } = this.props;
    return React.Children.map(children, this.processChildren)
  }

  processChildren(child) {
    const { styles } = this.props;
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

    // pass on CSS modules
    childProps.styles = styles;

    // pass on form state to Form State Components
    if (FORM_STATE_COMPONENTS.includes(child.type)) {
      childProps.formState = this.state.formState;
    }

    // handle children of OnActive components
    if (child.type === OnActive) {
      childProps.parsedChildren = React.Children.map(child.props.children, this.processChildren);
    }

    return React.cloneElement(child, { ...childProps });
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

    // pass cookies as a form value b/c cloud functions strip cookies (other than __session) from request
    formValues.cookie = document.cookie;

    // check for custom submit
    const submit = this.props.submit || this.defaultSubmit;

    // submit
    const { action } = this.props;
    submit(action, formValues)
      .then(result => {
        this.setState({ formState: 'resolved' });
      })
      .catch(err => {
        console.error(err);
        this.setState({ formState: 'failed' });
      });
    this.setState({ formState: 'submitting' });
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

  render() {
    const { action, className, encType, styles = {} } = this.props;
    const { formState } = this.state;

    return (
      <a name="form">
        <form
          className={styles.form || `${className} registration--form`}
          action={action}
          method="post"
          data-formstatus={formState}
          onChange={this.getInputValues}
          encType={encType}
        >
          {this.cloneChildren()}
        </form>
        <div onClick={() => { this.setState({ formState: 'active' }) }}>Active</div>
        <div onClick={() => { this.setState({ formState: 'submitting' }) }}>Submitting</div>
        <div onClick={() => { this.setState({ formState: 'failed' }) }}>Failed</div>
        <div onClick={() => { this.setState({ formState: 'resolved' }) }}>Resolved</div>
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
  className: PropTypes.string,
  submit: PropTypes.func,
  encType: PropTypes.string,
  styles: PropTypes.object,
};

Form.defaultProps = {
  className: '',
  encType: '',
};

module.exports = Form;