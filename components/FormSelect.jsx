const React = require('react');
const PropTypes = require('prop-types');
const FormField = require('./FormField');
const Label = require('./Label');

class FormSelect extends FormField {
  constructor(props) {
    super(props);
    this.selectionValidityState = this.selectionValidityState.bind(this);
    this.validOptions = FormSelect.getValidOptions(props.children);
    this.blurHandler = this.blurHandler.bind(this);
  }

  componentDidMount() {
    const labelUp = this.getValue() !== 'unselected';
    this.setState({ labelUp });
  }

  blurHandler() {
    const labelUp = this.getValue() !== 'unselected';
    const isValid = this.selectionValidityState();
    this.setState({ labelUp, isValid });
  }

  selectionValidityState() {
    const value = this.getValue();
    const { validator, required } = this.props;
    if (validator) {
      return validator(value, required);
    }
    if (required) return value !== 'unselected';
    return true;
  }

  static getValidOptions(children) {
    try {
      const options = [];
      children.forEach(child => {
        const { value } = child.props;
        if (value) options.push(value);
      });
      return options;
    } catch (err) {
      return null;
    }
  }

  render() {
    const {
      name,
      styles = {},
      children,
      size,
      required,
      multiple,
      label,
      className = styles.prettySelect || 'form--pretty-select',
      rowClassName = styles.prettyRow || 'pretty-row',
      validationClassName = styles.prettyValidation || 'pretty-validation',
      labelTextClassName = styles.prettyLabelText || 'pretty-label-text',
      labelClassName = styles.prettyLabel || 'pretty-label',
      initialValue,
      defaultValue = 'unselected',
    } = this.props;
    const { validationMessage, isValid, labelUp } = this.state;

    const startingValue = this.validOptions && this.validOptions.includes(initialValue) ?
      initialValue :
      defaultValue;

    return (
      <div className={rowClassName}>
        <Label
          htmlFor={name}
          label={label}
          className={labelClassName}
          labelTextClassName={labelTextClassName}
          data-validity={isValid}
          data-active={labelUp}
        >
          <select
            className={className}
            name={name}
            required={required}
            size={size}
            multiple={multiple}
            ref={this.inputRef}
            onClick={this.clickHandler}
            onBlur={this.blurHandler}
            onFocus={this.focusHandler}
            defaultValue={startingValue}
          >
            <option value="unselected" disabled hidden />
            {children}
          </select>
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

FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  initialValue: PropTypes.string,
  validator: PropTypes.func,
  validationMessage: PropTypes.string,
  children: PropTypes.node,
};

FormSelect.defaultProps = {
  size: 1,
  required: false,
  multiple: false,
};

module.exports = FormSelect;
