const React = require('React');
const capitalize = require('./capitalize');

function createFormStatusWrapper(status) {
    const FormStatusWrapper = ({ formState, children, className }) => {
        if (formState === status) {
            return (
                <div data-formstatus={formState} className={className}>
                    {children}
                </div>
            )
        }

        return null;
    }

    FormStatusWrapper.displayName = `On${capitalize(status)}`;

    return FormStatusWrapper;
}

module.exports = createFormStatusWrapper;