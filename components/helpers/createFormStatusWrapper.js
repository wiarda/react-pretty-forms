/* eslint-disable react/prop-types */
const React = require('react');
const capitalize = require('./capitalize');

function createFormStatusWrapper(status) {
  const FormStatusWrapper = props => {
    const { formState, children, className } = props;
    if (formState === status) {
      return (
        <div data-formstatus={formState} className={className}>
          {children}
        </div>
      );
    }

    return null;
  };

  FormStatusWrapper.displayName = `If${capitalize(status)}`;
  FormStatusWrapper._prettyType = `If${capitalize(status)}`;

  return FormStatusWrapper;
}

module.exports = createFormStatusWrapper;
