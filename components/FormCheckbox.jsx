const React = require('react');
const PropTypes = require('prop-types');
const FormFieldPretty = require('./FormFieldPretty');

const { defaultValidator, selectDefaultValidityMessage } = require('../validation/validation');

class FormCheckbox extends FormFieldPretty {
  constructor(props) {
    super(props);
    this.getValue = this.getValue.bind(this);
    this.inputRef = React.createRef();
  }

  getValue() {
    const isChecked = this.inputRef.current.checked;
    if (isChecked) return this.inputRef.current.value;
    return false;
  }

  render() {
    const { name, label = false, type = 'text', size = '20px', checked, value } = this.props;

    const hiddenStyle = {
      visibility: 'hidden',
      margin: 'unset',
      padding: 'unset',
      height: '0',
    };

    const flexWrapper = {
      display: 'flex',
    };

    const checkbox = {
      flex: '0 0 auto',
      height: size,
      width: size,
    };

    const checkboxLabel = {
      flex: '1 1 auto',
      paddingLeft: '1rem',
      textAlign: 'left',
      fontSize: '90%',
    };

    const labelComponent = label ? (
      <label style={checkboxLabel} htmlFor={name}>
        {label}
      </label>
    ) : null;

    return (
      <div
        className="form--pretty-row form--pretty-checkbox"
        style={type === 'hidden' ? hiddenStyle : {}}
      >
        <div style={flexWrapper}>
          <input
            style={checkbox}
            type={type}
            name={name}
            ref={this.inputRef}
            defaultChecked={checked}
            value={value}
          />

          {labelComponent}
        </div>
      </div>
    );
  }
}

FormFieldPretty.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  initialValue: PropTypes.string,
  validator: PropTypes.func,
  validationMessage: PropTypes.string,
};

FormFieldPretty.defaultProps = {
  value: 'checkbox',
};

module.exports = FormCheckbox;