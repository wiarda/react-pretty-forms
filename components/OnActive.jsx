const React = require('react');

const OnActive = ({ formState, className, parsedChildren }) => {

    if (formState === 'active') {
        return (
            <div data-formstatus={formState} className={className}>
                {parsedChildren}
            </div >
        )
    }

    return null;
}

module.exports = React.memo(OnActive);