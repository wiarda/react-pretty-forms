/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
const React = require('react');
const PropTypes = require('prop-types');

const IfActive = (
  {
    styles = {},
    className = styles.prettyActive || 'pretty-active',
    formState,
    parsedChildren,
  },
) => {
  if (formState === 'active') {
    return (
      <div data-formstatus={formState} className={className}>
        {parsedChildren}
      </div>
    );
  }

  return null;
};

IfActive.propTypes = {
  className: PropTypes.string,
};

IfActive._prettyType = 'IfActive';

module.exports = React.memo(IfActive);
