const React = require('react');

const FormResolved = ({ formState, children, className }) => {
    
    console.log('Form Resolved Component', formState)
    if (formState === 'resolved') {
        return (
            <div data-formstatus={formState} className={className}>
                {children}
            </div>
        )
    }

    return null;
}

module.exports = React.memo(FormResolved);