/* eslint-disable react/require-default-props */
const React = require('react');
const PropTypes = require('prop-types');

function FormButton(props) {
  const {
    value,
    submitHandler,
    styles,
    style,
    type,
    className = styles.prettyButton || 'pretty-button',
    ...remainingProps
  } = props;

  return (
    <input
      type={type}
      className={className}
      value={value}
      onClick={submitHandler}
      style={style}
      {...remainingProps}
    />
  );
}

FormButton.propTypes = {
  value: PropTypes.string,
  type: PropTypes.string,
  submitHandler: PropTypes.func,
  className: PropTypes.string,
  styles: PropTypes.shape({}),
  style: PropTypes.shape({}),
};

FormButton.defaultProps = {
  value: 'Submit',
  type: 'submit',
  styles: {},
  style: {},
};

FormButton._prettyType = 'Button';

module.exports = FormButton;
