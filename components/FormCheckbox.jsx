const React = require('react');
const PropTypes = require('prop-types');
const FormField = require('./FormField');
const Label = require('./Label');

class FormCheckbox extends FormField {
  constructor(props) {
    super(props);
    this.getValue = this.getValue.bind(this);
    this.inputRef = React.createRef();
    this.deriveValidityState = this.deriveValidityState.bind(this);
    this.getValidationMessage = this.getValidationMessage.bind(this);
  }

  getValue() {
    const isChecked = this.inputRef.current.checked;
    if (isChecked) return this.inputRef.current.value;
    return false;
  }

  deriveValidityState() {
    const { validator, required } = this.props;
    const isChecked = this.getValue();
    if (validator) return validator(isChecked);
    if (required) return isChecked;
    return true;
  }

  getValidationMessage() {
    const { required } = this.props;
    return super.getValidationMessage('checkbox', required);
  }

  render() {
    const {
      name,
      styles = {},
      className = styles.prettyCheckbox || 'pretty-checkbox',
      rowClassName = styles.prettyRow || 'pretty-row',
      labelClassName = styles.prettyCheckboxLabel || 'pretty-checkbox-label',
      labelTextClassName = styles.prettyCheckboxLabelText || 'pretty-checkbox-label-text',
      validationClassName = styles.prettyValidation || 'pretty-validation',
      label = false,
      type = 'checkbox',
      checked,
      value,
    } = this.props;

    const { validationMessage, isValid } = this.state;

    return (
      <div className={rowClassName}>
        <Label
          htmlFor={name}
          label={label}
          labelTextClassName={labelTextClassName}
          className={labelClassName}
          data-validity={isValid}
        >
          <input
            id={name}
            className={className}
            type={type}
            name={name}
            ref={this.inputRef}
            defaultChecked={checked}
            value={value}
            data-validity={isValid}
            onClick={this.clickHandler}
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
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  initialValue: PropTypes.string,
  validator: PropTypes.func,
  validationMessage: PropTypes.string,
};

FormField.defaultProps = {
  type: 'checkbox',
  value: 'checkbox',
  name: 'checkbox',
};

module.exports = FormCheckbox;
