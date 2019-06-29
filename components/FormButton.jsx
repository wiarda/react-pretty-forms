const React = require('react');
const PropTypes = require('prop-types');

function FormButton({ value, submitHandler, type, style = {}, styles = {}, className = styles.prettyButton || 'pretty-button', ...props }) {
  return (
    <input
      type={type}
      className={className}
      value={value}
      onClick={submitHandler}
      style={style}
      {...props}
    />
  );
}

FormButton.propTypes = {
  value: PropTypes.string,
  submitHandler: PropTypes.func,
  type: PropTypes.string,
};

FormButton.defaultProps = {
  value: 'Submit',
  type: 'submit',
};

module.exports = FormButton;
