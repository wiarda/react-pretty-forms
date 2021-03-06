/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
/* global window */

const React = require('react');
const PropTypes = require('prop-types');
const Label = require('./Label');
const { hidden } = require('./helpers/styles');

const { defaultValidator, selectDefaultValidityMessage } = require('./helpers/validation');

class FormField extends React.PureComponent {
  constructor(props) {
    super(props);
    this.defaultValidator = this.defaultValidator.bind(this);
    this.deriveValidityState = this.deriveValidityState.bind(this);
    this.validate = this.validate.bind(this);
    this.getValue = this.getValue.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.blurHandler = this.blurHandler.bind(this);
    this.defaultBlur = this.defaultBlur.bind(this);
    this.focusHandler = this.focusHandler.bind(this);
    this.inputRef = React.createRef();
    this.imperativelySetValue = this.imperativelySetValue.bind(this);

    if (typeof window !== 'undefined') {
      this.isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
    }
    this.state = {
      isValid: true,
      validationMessage: this.getValidationMessage(),
      labelUp: true, // default label to minimized for non-JS environments
    };
  }

  componentDidMount() {
    const { initialValue } = this.props;
    this.setState({ labelUp: Boolean(initialValue) });
  }

  getValue() {
    return this.inputRef.current.value;
  }

  getValidationMessage() {
    const { validationMessage, name, required } = this.props;
    if (validationMessage) return validationMessage;
    if (validationMessage === false) return '';

    return selectDefaultValidityMessage(name, required);
  }

  defaultValidator(value) {
    const { name, required } = this.props;
    return defaultValidator(name, value, required);
  }

  deriveValidityState() {
    const value = this.getValue();
    const { validator, required } = this.props;
    if (validator) {
      return validator(value, required);
    }
    return this.defaultValidator(value);
  }

  validate() {
    const isValid = this.deriveValidityState();
    this.setState({ isValid });
    return isValid;
  }

  clickHandler() {
    this.setState({ labelUp: true, isValid: true });
  }

  focusHandler() {
    this.setState({ labelUp: true, isValid: true });
  }

  defaultBlur() {
    const labelUp = Boolean(this.getValue());
    const isValid = this.deriveValidityState();
    this.setState({ labelUp, isValid });
  }

  blurHandler() {
    // autofill on mobile can cause issues with revalidation / be distracting
    const { mobileBlur } = this.props;
    if (!mobileBlur && this.isMobile) return;

    this.defaultBlur();
  }

  imperativelySetValue(value) {
    if (this.inputRef.current) {
      this.inputRef.current.value = value;
      this.defaultBlur();
    }
  }

  render() {
    const {
      name,
      type,
      required = false,
      initialValue,
      styles = {},
      className = styles.prettyInput || 'pretty-input',
      rowClassName = styles.prettyRow || 'pretty-row',
      validationClassName = styles.prettyValidation || 'pretty-validation',
      labelTextClassName = styles.prettyLabelText || 'pretty-label-text',
      labelClassName = styles.prettyLabel || 'pretty-label',
      label = false,
      validationMessage: exclude,
      ...remaining
    } = this.props;
    const { validationMessage, isValid, labelUp } = this.state;

    return (
      <div
        className={rowClassName}
        style={type === 'hidden' ? hidden : {}}
        {...remaining}
      >
        <Label
          className={labelClassName}
          labelTextClassName={labelTextClassName}
          htmlFor={name}
          label={label}
          data-validity={isValid}
          data-active={labelUp}
        >
          <input
            className={className}
            required={required}
            type={type}
            name={name}
            ref={this.inputRef}
            defaultValue={initialValue}
            onBlur={this.blurHandler}
            onFocus={this.focusHandler}
            data-validity={isValid}
          />
        </Label>
        <div
          className={validationClassName}
          data-validity={isValid}
        >
          {validationMessage}
        </div>
      </div>
    );
  }
}

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  initialValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  required: PropTypes.bool,
  className: PropTypes.string,
  rowClassName: PropTypes.string,
  validationClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  labelTextClassName: PropTypes.string,
  validator: PropTypes.func,
  validationMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};

FormField.defaultProps = {
  required: false,
  label: false,
  type: 'text',
};

FormField._prettyType = 'Field';

module.exports = FormField;
