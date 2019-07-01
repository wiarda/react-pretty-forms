const React = require('react');
const PropTypes = require('prop-types');

const FormStatusWrapper = ({ children, formState, ...props }) => {
  const forwardProps = child => React.cloneElement(child, props);
  const parsedChildren = React.Children.map(children, forwardProps);

  return (
    <div data-formstatus={formState}>
      {parsedChildren}
    </div>
  );
};

FormStatusWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  formState: PropTypes.string,
};

FormStatusWrapper.defaultProps = {
  formState: 'active',
};

module.exports = FormStatusWrapper;
