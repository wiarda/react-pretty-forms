/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */

const React = require('react');
const PropTypes = require('prop-types');
const FormField = require('./FormField');
const Label = require('./Label');
const { hidden } = require('./helpers/styles');


class TextArea extends FormField {
  render() {
    const {
      name,
      type,
      required = false,
      initialValue,
      styles = {},
      className = styles.prettyTextarea || 'pretty-textarea',
      rowClassName = styles.prettyRow || 'pretty-row',
      validationClassName = styles.prettyValidation || 'pretty-validation',
      labelTextClassName = styles.prettyLabelTextTextarea || 'pretty-label-text-textarea',
      labelClassName = styles.prettyLabelTextarea || 'pretty-label-textarea',
      label = false,
      validationMessage: exclude,
      rows,
      cols,
      placeholder,
      ...remaining
    } = this.props;
    const { validationMessage, isValid, labelUp } = this.state;

    return (
      <div className={rowClassName} style={type === 'hidden' ? hidden : {}} {...remaining}>
        <Label
          className={labelClassName}
          labelTextClassName={labelTextClassName}
          htmlFor={name}
          label={label}
          data-validity={isValid}
          data-active={labelUp}
        />
        <textarea
          className={className}
          rows={rows}
          cols={cols}
          placeholder={placeholder}
          required={required}
          name={name}
          ref={this.inputRef}
          defaultValue={initialValue}
          onBlur={this.blurHandler}
          onFocus={this.focusHandler}
          data-validity={isValid}
        />
        <div className={validationClassName} data-validity={isValid}>
          {validationMessage}
        </div>
      </div>
    );
  }
}

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  required: PropTypes.bool,
  className: PropTypes.string,
  rowClassName: PropTypes.string,
  validationClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  labelTextClassName: PropTypes.string,
  validator: PropTypes.func,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

TextArea.defaultProps = {
  required: false,
  label: false,
  type: 'text',
};

TextArea._prettyType = 'TextArea';

module.exports = TextArea;
