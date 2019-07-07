const React = require('react');
const PropTypes = require('prop-types');
const FormField = require('./FormField');

class FormFile extends FormField {
  getValue() {
    return this.inputRef.current.files;
  }

  validate() {
    const value = this.getValue();
    const { validator, name, required } = this.props;
    let isValid;
    if (validator) {
      isValid = validator(value);
    } else {
      isValid = Boolean(value[0]);
    }

    this.setState({ isValid });
    return isValid;
  }

  render() {
    const {
      name,
      initialValue,
      label = false,
      accept,
      required = false,
      multiple = false,
    } = this.props;
    const { validationMessage, isValid } = this.state;

    const labelComponent = label ? (
      <label className="form--label" htmlFor={name}>
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
        <div className="form--pretty-row">
          {labelComponent}
          <div className="form--input-wrapper">
            <input
              className="form--input-file"
              required={required}
              type="file"
              name={name}
              accept={accept}
              ref={this.inputRef}
              defaultValue={initialValue}
              onClick={this.resetValidity}
              data-validity={isValid}
              multiple={multiple}
            />
            <div className="form--validation" data-validity={isValid}>
              {validationMessage}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

FormFile.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  accept: PropTypes.string,
  required: PropTypes.bool,
  initialValue: PropTypes.string,
  validator: PropTypes.func,
  validationMessage: PropTypes.string,
  multiple: PropTypes.bool,
};

FormFile.defaultProps = {
  accept: '.csv,.xls',
};


module.exports = FormFile;
