const React = require('react');
const PropTypes = require('prop-types');

const { defaultValidator, selectDefaultValidityMessage } = require('../validation/validation');

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
      labelUp: true, // so that in non-js environments, label appears minimized
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
      return validator(value);
    }
    return defaultValidator(name, value, required);
  }

  // hook for external functions
  validate() {
    const isValid = this.deriveValidityState();
    this.setState({ isValid });
    return isValid;
  }

  clickHandler(e) {
    // e.stopPropagation();
    // moves label to upper-position and clears validity messages
    this.setState({ labelUp: true, isValid: true });
  }

  focusHandler() {
    // moves label to upper-position and clears validity messages
    this.setState({ labelUp: true, isValid: true });
  }

  blurHandler() {
    // don't check on fill for mobile
    if (this.isMobile) return;

    // check if label should return to central position
    const labelUp = Boolean(this.getValue());
    // console.log(this.getValue());

    // check if validity message ought to display
    const isValid = this.deriveValidityState();
    this.setState({ labelUp, isValid });
  }

  render() {
    const {
      name,
      initialValue,
      label = false,
      type = 'text',
      required = false,
      styles = {},
    } = this.props;
    const { validationMessage, isValid, labelUp } = this.state;

    const labelComponent = label ? (
      <label
        className={styles.prettyLabel || 'form--pretty-label'}
        htmlFor={name}
        data-active={labelUp}
      >
        {label}
      </label>
    ) : null;

    const hiddenStyle = {
      visibility: 'hidden',
      margin: 'unset',
      padding: 'unset',
      height: '0',
    };

    return (
      <React.Fragment>
        <div
          className={styles.prettyRow || 'form--pretty-row'}
          style={type === 'hidden' ? hiddenStyle : {}}
        >
          <div className={styles.prettyInputWrapper || 'form--pretty-input-wrapper'}>
            {labelComponent}
            <input
              className={styles.prettyInput || 'form--pretty-input'}
              required={required}
              type={type}
              name={name}
              ref={this.inputRef}
              defaultValue={initialValue}
              onBlur={this.blurHandler}
              // onClick={this.clickHandler}
              onFocus={this.focusHandler}
              data-validity={isValid}
            />
            <div
              className={styles.prettyValidation || 'form--pretty-validation'}
              data-validity={isValid}
            >
              {validationMessage}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

FormField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  initialValue: PropTypes.string,
  validator: PropTypes.func,
  validationMessage: PropTypes.string,
};

module.exports = FormField;