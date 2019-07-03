/* eslint-disable max-len */
/* global window */

const React = require('react');
const PropTypes = require('prop-types');
const fetch = require('whatwg-fetch');

const FormField = require('./FormField');
const FormFieldFile = require('./FormFieldFile');
const FormButton = require('./FormButton');
const FormSelectPretty = require('./FormSelect');
const FormCheckbox = require('./FormCheckbox');
const FormStatusWrapper = require('./FormStatusWrapper');

const IfResolved = require('./IfResolved');
const IfFailed = require('./IfFailed');
const IfSubmitting = require('./IfSubmitting');
const IfActive = require('./IfActive');

const INPUT_TYPES = [FormFieldFile, FormField, FormSelectPretty, FormCheckbox];
const FORM_STATE_COMPONENTS = [FormStatusWrapper, IfResolved, IfFailed, IfSubmitting, IfActive];

// ToDo:
// include cookies in form as a setting

// hp:
// checkbox: toggle validated on click
// -allow custom classnames on all components
// -remove form-status from FormFields
// -add a wrapper class that exposes Form's get values field
// -rename modular styles for clarity
// -for form pretty: option to disable label up on mobile (defaulty to true)

// lp:
// improve naming conventions for css in subelements

/**
 * title = the form's title text
 * action = api endpoint to submit form
 * accepts url parameters to prefill form, as well as a source parameter
 * to track link sources
 */
class Form extends React.PureComponent {
  static defaultSubmit(action, formValues) {
    return fetch(action, {
      method: 'POST',
      body: JSON.stringify(formValues),
    });
  }

  static parseParameters() {
    if (typeof window !== 'undefined') {
      try {
        const rawParams = window.location.search.slice(1);
        const params = new URLSearchParams(rawParams);
        const initialValues = {};

        params.entries().forEach(param => {
          const [name, value] = param;
          initialValues[name] = value;
        });

        return initialValues;
      } catch (err) {
        return {};
      }
    }
    return {};
  }

  constructor(props) {
    super(props);

    // methods
    this.submitHandler = this.submitHandler.bind(this);
    this.validateEntries = this.validateEntries.bind(this);
    this.getInputValues = this.getInputValues.bind(this);
    this.cloneChildren = this.cloneChildren.bind(this);
    this.processChildren = this.processChildren.bind(this);
    this.generateRefs = this.generateRefs.bind(this);
    this.saveFormInput = this.saveFormInput.bind(this);

    // initiate form state
    this.state = { formState: 'active' };

    // parse parameter values
    this.initialValues = Form.parseParameters();

    // generate refs for input fields
    this.inputRefs = {};
    this.fieldNames = [];
    React.Children.forEach(props.children, this.generateRefs);
  }

  getInputValues() {
    const currentValues = {};
    try {
      this.fieldNames.forEach(fieldName => {
        currentValues[fieldName] = this.inputRefs[fieldName].current.getValue();
      });
    } catch (err) {
      return this.initialValues;
    }
    return currentValues;
  }

  saveFormInput(formValues = this.getInputValues()) {
    this.initialValues = formValues;
  }

  generateRefs(child) {
    if (INPUT_TYPES.includes(child.type)) {
      const fieldName = child.props && child.props.name;
      this.inputRefs[fieldName] = React.createRef();
      this.fieldNames.push(fieldName);
    }
    if (child.type === IfActive) {
      React.Children.forEach(child.props.children, this.generateRefs);
    }
  }

  cloneChildren() {
    const { children } = this.props;
    return React.Children.map(children, this.processChildren);
  }

  processChildren(child) {
    const { styles } = this.props;
    const childProps = {};
    const fieldName = child.props && child.props.name;

    // add refs and initial / saved values to inputs
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
      const { formState } = this.state;
      childProps.formState = formState;
    }
    // handle children of OnActive components
    if (child.type === IfActive) {
      childProps.parsedChildren = React.Children.map(child.props.children, this.processChildren);
    }

    // forward props in FormStateWrapper
    if (child.type === FormStatusWrapper) {
      Object.assign(childProps, { form: this });
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

  submitHandler(e) {
    e.preventDefault();

    // check for validity
    const isFormValid = this.validateEntries();
    if (!isFormValid) return;

    // gather form values for submission
    const formValues = this.getInputValues();

    // pass cookies as a form value b/c cloud fns strip cookies (other than __session) from req
    // eslint-disable-next-line no-undef
    formValues.cookie = document && document.cookie;

    // save current values
    this.saveFormInput(formValues);

    // check for custom submit
    const { submit = Form.defaultSubmit } = this.props;

    // submit
    const { action } = this.props;
    submit(action, formValues)
      .then(() => {
        this.setState({ formState: 'resolved' });
      })
      .catch(() => {
        this.setState({ formState: 'failed' });
      });
    this.setState({ formState: 'submitting' });
  }

  render() {
    const {
      action, className, encType, styles = {},
    } = this.props;
    const { formState } = this.state;

    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }
}

Form.propTypes = {
  action: PropTypes.string.isRequired,
  className: PropTypes.string,
  submit: PropTypes.func,
  encType: PropTypes.string,
  styles: PropTypes.shape({}),
  children: PropTypes.node,
};

Form.defaultProps = {
  children: null,
  className: '',
  encType: '',
  submit: Form.defaultSubmit,
  styles: {},
};

module.exports = Form;
