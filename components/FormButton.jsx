const React = require('react');
const PropTypes = require('prop-types');

function FormButton({ value, submitHandler, type, style = {}, styles = {}, ...props }) {
  return (
    <input
      type={type}
      className={styles.formButton || 'form--button'}
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
