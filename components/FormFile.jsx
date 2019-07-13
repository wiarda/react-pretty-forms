const React = require('react');
const PropTypes = require('prop-types');
const FormField = require('./FormField');
const Label = require('./Label');

class FormFile extends FormField {
  getValue() {
    return this.inputRef.current.files;
  }

  render() {
    const {
      name,
      initialValue,
      accept,
      required = false,
      multiple = false,
      styles = {},
      className = styles.prettyFile || 'pretty-file',
      rowClassName = styles.prettyRow || 'pretty-row',
      validationClassName = styles.prettyValidation || 'pretty-validation',
      labelTextClassName = styles.prettyLabelText || 'pretty-label-text',
      labelClassName = styles.prettyLabel || 'pretty-label',
      label = false,
    } = this.props;
    const { validationMessage, isValid, labelUp } = this.state;

    return (
      <React.Fragment>
        <div className={rowClassName}>
          <Label
            className={labelClassName}
            labelTextClassName={labelTextClassName}
            htmlFor={name}
            label={label}
            data-validity={isValid}
            data-active={labelUp}
          >
            <input
              type="file"
              className={className}
              required={required}
              name={name}
              accept={accept}
              ref={this.inputRef}
              defaultValue={initialValue}
              onClick={this.resetValidity}
              data-validity={isValid}
              multiple={multiple}
            />
          </Label>
          <div
            className={validationClassName}
            data-validity={isValid}
          >
            {validationMessage}
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

FormFile._prettyType = 'File';

module.exports = FormFile;
