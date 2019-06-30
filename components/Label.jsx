/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
const React = require('react');
const PropTypes = require('prop-types');

function Label({
  label,
  labelTextClassName,
  children,
  ...props
}) {
  if (label) {
    return (
      <label
        {...props}
      >
        <span className={labelTextClassName}>
          {label}
        </span>
        {children}
      </label>
    );
  }
  return { children };
}


Label.propTypes = {
  label: PropTypes.string,
};

Label.defaultProps = {
  label: null,
};

module.exports = React.memo(Label);
