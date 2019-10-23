const React = require('react');
const PropTypes = require('prop-types');
const FormField = require('./FormField');
const Label = require('./Label');

class FormCheckbox extends FormField {
  getValue() {
    const isChecked = this.inputRef.current.checked;
    if (isChecked) return this.inputRef.current.value;
    return false;
  }

  defaultValidator(value) {
    const { required } = this.props;
    if (required) return Boolean(value);
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
      checked,
      value,
      onChange,
      ...remaining
    } = this.props;

    const { validationMessage, isValid } = this.state;

    return (
      <div className={rowClassName} {...remaining}>
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
            type="checkbox"
            name={name}
            ref={this.inputRef}
            defaultChecked={checked}
            value={value}
            data-validity={isValid}
            onClick={this.clickHandler}
            onChange={onChange}
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

FormCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  initialValue: PropTypes.string,
  validator: PropTypes.func,
  validationMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};

FormCheckbox.defaultProps = {
  value: 'Yes',
  name: 'checkbox',
};

FormCheckbox._prettyType = 'Checkbox';

module.exports = FormCheckbox;
