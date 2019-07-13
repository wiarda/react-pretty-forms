/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
const React = require('react');

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
        <span className={labelTextClassName} data-active={props['data-active']}>
          {label}
        </span>
        {children}
      </label>
    );
  }
  return (
    <React.Fragment>
      {children};
    </React.Fragment>
  );
}

module.exports = React.memo(Label);
