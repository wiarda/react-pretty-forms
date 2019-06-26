const React = require('react');

const FormStateWrapper = ({children, formState}) => {

    // const statefulChildren = React.Children.map(children, child => {
    //     return React.cloneElement(child, { ...props });
    // }) || null;


    return (
        <div data-formstatus={formState}>
            {children}
        </div>
    )
}

module.exports = FormStateWrapper;