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
    this.deriveValidityState = this.deriveValidityState.bind(this);
    this.validate = this.validate.bind(this);
    this.getValue = this.getValue.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.blurHandler = this.blurHandler.bind(this);
    this.focusHandler = this.focusHandler.bind(this);
    this.inputRef = React.createRef();
    this.state = {
      isValid: true,
      validationMessage: this.getValidationMessage(),
      labelUp: true, // default label to minimized for non-JS environments
    };
  }

  componentDidMount() {
    const { initialValue } = this.props;
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
    this.setState({ labelUp: Boolean(initialValue) });
  }

  getValue() {
    return this.inputRef.current.value;
  }

  getValidationMessage() {
    const { validationMessage, name, required } = this.props;
    if (validationMessage) return validationMessage;

    return selectDefaultValidityMessage(name, required);
  }

  deriveValidityState() {
    const value = this.getValue();
    const { validator, name, required } = this.props;
    if (validator) {
      return validator(value, required);
    }
    return defaultValidator(name, value, required);
  }

  // hook for external functions
  validate() {
    const isValid = this.deriveValidityState();
    this.setState({ isValid });
    return isValid;
  }

  clickHandler() {
    // e.stopPropagation();
    // moves label to upper-position and clears validity messages
    this.setState({ labelUp: true, isValid: true });
  }

  focusHandler() {
    // moves label to upper-position and clears validity messages
    this.setState({ labelUp: true, isValid: true });
  }

  blurHandler() {
    // don't check on mobile
    if (this.isMobile) return;

    // check if label should return to central position
    const labelUp = Boolean(this.getValue());

    // check if validity message ought to display
    const isValid = this.deriveValidityState();
    this.setState({ labelUp, isValid });
  }

  render() {
    const {
      name,
      type = 'text',
      required = false,
      initialValue,
      styles = {},
      className = styles.prettyInput || 'pretty-input',
      rowClassName = styles.prettyRow || 'pretty-row',
      validationClassName = styles.prettyValidation || 'pretty-validation',
      labelTextClassName = styles.prettyLabelText || 'pretty-label-text',
      labelClassName = styles.prettyLabel || 'pretty-label',
      label = false,
    } = this.props;
    const { validationMessage, isValid, labelUp } = this.state;

    return (
      <div
        className={rowClassName}
        style={type === 'hidden' ? hidden : {}}
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
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  initialValue: PropTypes.string.isRequired,
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
  validationMessage: PropTypes.string,
  styles: PropTypes.shape({}),
};

FormField.defaultProps = {
  required: false,
  label: false,
};

module.exports = FormField;
