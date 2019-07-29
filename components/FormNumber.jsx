const React = require('react');
const PropTypes = require('prop-types');
const FormField = require('./FormField');
const Label = require('./Label');

class FormNumber extends FormField {
  render() {
    const {
      name,
      required = false,
      initialValue,
      styles = {},
      className = styles.prettyInput || 'pretty-input',
      rowClassName = styles.prettyRow || 'pretty-row',
      validationClassName = styles.prettyValidation || 'pretty-validation',
      labelTextClassName = styles.prettyLabelText || 'pretty-label-text',
      labelClassName = styles.prettyLabel || 'pretty-label',
      label = false,
      min,
      max,
      validationMessage: exclude,
      ...remaining
    } = this.props;
    const { validationMessage, isValid, labelUp } = this.state;

    return (
      <div
        className={rowClassName}
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
            type="number"
            min={min}
            max={max}
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

FormNumber.propTypes = {
  name: PropTypes.string.isRequired,
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

FormNumber.defaultProps = {
  required: false,
  label: false,
  type: 'text',
};

FormNumber._prettyType = 'Field';

module.exports = FormNumber;
