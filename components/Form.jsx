/* eslint-disable react/require-default-props */
/* eslint-disable max-len */
/* global window document  */

const React = require('react');
const PropTypes = require('prop-types');
// disabling polyfills -- allow users to implement instead
// if (typeof window !== 'undefined') require('whatwg-fetch'); // polyfill for fetch

const FORM_STATE_COMPONENTS = ['StatusWrapper', 'IfResolved', 'IfFailed', 'IfSubmitting', 'IfActive'];
const INPUT_TYPES = ['Field', 'File', 'Select', 'Checkbox', 'TextArea'];

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
      redirect: 'manual',
    });
  }

  static parseParameters() {
    if (typeof window !== 'undefined') {
      try {
        const rawParams = window.location.search.slice(1);
        const params = new URLSearchParams(rawParams);
        const initialValues = {};

        Array.from(params).forEach(param => {
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
    this.submitHandler = this.submitHandler.bind(this);
    this.validateEntries = this.validateEntries.bind(this);
    this.getInputValues = this.getInputValues.bind(this);
    this.cloneChildren = this.cloneChildren.bind(this);
    this.processChildren = this.processChildren.bind(this);
    this.generateRefs = this.generateRefs.bind(this);
    this.saveFormInput = this.saveFormInput.bind(this);
    this.setFormState = this.setFormState.bind(this);
    this.exposeRefs = this.exposeRefs.bind(this);
    this.exposeFieldRef = this.exposeFieldRef.bind(this);
    this.exposeFieldInputRef = this.exposeFieldInputRef.bind(this);
    this.getFormBoundingRect = this.getFormBoundingRect.bind(this);

    this.state = { formState: 'active' };
    this.initialValues = Form.parseParameters();

    // generate refs for input fields
    this.inputRefs = {};
    this.fieldNames = [];
    this.formElementRef = React.createRef();
    React.Children.forEach(props.children, this.generateRefs);

    // on-load custom code
    if (props.loadEvent) props.loadEvent(this);
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

  setFormState(type) {
    this.setState({ formState: type });
  }

  getFormBoundingRect() {
    return this.formElementRef.current.getBoundingClientRect();
  }

  saveFormInput(formValues = this.getInputValues()) {
    this.initialValues = formValues;
  }

  generateRefs(child) {
    const { type: { _prettyType: prettyType } } = child;
    const wrapperType = prettyType || (child.type.type && child.type.type._prettyType);

    if (INPUT_TYPES.includes(prettyType)) {
      const fieldName = child.props && child.props.name;
      this.inputRefs[fieldName] = React.createRef();
      this.fieldNames.push(fieldName);
    }

    if (wrapperType === 'IfActive') {
      React.Children.forEach(child.props.children, this.generateRefs);
    }
  }

  cloneChildren() {
    const { children } = this.props;
    return React.Children.map(children, this.processChildren);
  }

  processChildren(child) {
    const { cssModule: styles } = this.props;
    const { type: { _prettyType: prettyType } } = child;
    const wrapperType = prettyType || (child.type.type && child.type.type._prettyType);

    const childProps = {};
    const fieldName = child.props && child.props.name;

    // add refs and initial / saved values to inputs
    if (INPUT_TYPES.includes(prettyType)) {
      childProps.initialValue = this.initialValues[fieldName] || child.props.initialValue;
      childProps.ref = this.inputRefs[fieldName];
    }

    // add submit handler to submit button
    if (prettyType === 'Button') {
      childProps.submitHandler = this.submitHandler;
    }

    // pass on CSS modules
    childProps.styles = styles;

    // pass on form state to Form State Components
    if (FORM_STATE_COMPONENTS.includes(wrapperType)) {
      const { formState } = this.state;
      childProps.formState = formState;
    }
    // handle children of OnActive components
    if (wrapperType === 'IfActive') {
      childProps.parsedChildren = React.Children.map(child.props.children, this.processChildren);
    }

    // forward props in FormStateWrapper
    if (wrapperType === 'StatusWrapper') {
      Object.assign(childProps, { form: this });
    }
    return React.cloneElement(child, { ...childProps });
  }

  validateEntries() {
    // return true if all input fields are valid
    return Object.values(this.inputRefs).reduce((acc, curr) => {
      const currentValidation = curr.current.validate();
      return acc && currentValidation;
    }, true);
  }

  submitHandler(e) {
    e.preventDefault();
    const { action, successEvent, failEvent } = this.props;

    // check for validity
    const isFormValid = this.validateEntries();
    if (!isFormValid) {
      if (failEvent) {
        // custom fail code here
        failEvent(this, { Error: 'Invalid form inputs.' });
      }
      return 'Invalid';
    }


    // gather form values for submission
    const formValues = this.getInputValues();

    // pass cookies as a form value b/c cloud fns strip cookies (other than __session) from req
    formValues.cookie = document && document.cookie;
    formValues.__protocol = 'fetch';

    // save current values
    this.saveFormInput(formValues);

    // check for custom submit
    const { submit = Form.defaultSubmit } = this.props;

    // submit
    const submission = submit(action, formValues)
      .then(res => {
        if (successEvent) successEvent(this); // custom success handling
        if (res === 'OVERRIDE') return;
        this.setState({ formState: 'resolved' });
      })
      .catch((err) => {
        if (failEvent) { // custom fail handling
          failEvent(this, { Error: err });
        }
        this.setState({ formState: 'failed' });
      });
    this.setState({ formState: 'submitting' });
    return submission;
  }

  exposeRefs() {
    return this.inputRefs;
  }

  exposeFieldRef(fieldName) {
    return this.inputRefs && this.inputRefs[fieldName] && this.inputRefs[fieldName].current;
  }

  exposeFieldInputRef(fieldName) {
    return this.inputRefs && this.inputRefs[fieldName] && this.inputRefs[fieldName].current.inputRef.current;
  }

  render() {
    const {
      action,
      cssModule: styles,
      className = styles.prettyForm || 'pretty-form',
      encType,
    } = this.props;
    const { formState } = this.state;
    return (
      <React.Fragment>
        <form
          action={action}
          className={className}
          method="post"
          data-formstatus={formState}
          onChange={this.getInputValues}
          encType={encType}
          ref={this.formElementRef}
        >
          {this.cloneChildren()}
        </form>
      </React.Fragment>
    );
  }
}

Form.propTypes = {
  action: PropTypes.string.isRequired,
  allowMobileBlur: PropTypes.bool,
  className: PropTypes.string,
  submit: PropTypes.func,
  encType: PropTypes.string,
  cssModule: PropTypes.shape({}),
  children: PropTypes.node,
  loadEvent: PropTypes.func,
  successEvent: PropTypes.func,
  failEvent: PropTypes.func,
};

Form.defaultProps = {
  children: null,
  allowMobileBlur: false,
  encType: '',
  submit: Form.defaultSubmit,
  cssModule: {},
};

module.exports = Form;
