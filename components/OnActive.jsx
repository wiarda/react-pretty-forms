const React = require('react');

const OnActive = ({ formState, className, parsedChildren }) => {

    let visibility = formState === 'active' ? {} : {
        opacity: 0, position: 'absolute', left: '-999em', pointerEvents: 'none'
    }

    return (
        <div data- formstatus={formState} className={className} style={visibility} >
            {parsedChildren}
        </div >
    )
}





module.exports = React.memo(OnActive);