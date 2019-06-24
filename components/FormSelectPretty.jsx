const React = require('react');
const PropTypes = require('prop-types');
const FormFieldPretty = require('./FormFieldPretty');

const { defaultValidator, selectDefaultValidityMessage } = require('../validation/validation');

class FormSelectPretty extends FormFieldPretty {
  // constructor(props) {
  //   super(props);
  //   // this.selectInitialValue = this.selectInitialValue.bind(this);

  //   // this.options = this.selectInitialValue();

  //   // this.state = {
  //   //   isValid: false,
  //   //   validationMessage: this.getValidationMessage(),
  //   // };
  // }

  constructor(props) {
    super(props);
    this.startingValue = props.initialValue || props.defaultValue || 'unselected';
  }

  // componentDidMount() {
  //   const { initialValue } = this.props;
  //   this.isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
  //   this.setState({ labelUp: Boolean(initialValue) });
  // }

  blurHandler() {
    // check if label should return to central position
    const labelUp = this.getValue() !== 'unselected';

    // check if validity message ought to display
    const isValid = this.deriveValidityState();
    this.setState({ labelUp, isValid });
  }

  // initially deprecated in favor of using the "value" prop on Select, as per React recommendations
  // However, while this works in a dev environment, once hosted it doesn't properly refresh, perhaps because of race condtions
  // force a rerender of the children if an initialValue is given after mounting
  static selectInitialValue(props) {
    // if initialValue prop is passed, select the child option of the same value
    const { initialValue, children } = props;
    if (initialValue) {
      console.log('parsing selction options to find', initialValue);
      return React.Children.map(children, child => {
        if (initialValue === child.props.value) {
          console.log('selecting', child.props.value);
          // select this option
          console.log(React.cloneElement(child, { selected: true }));
          return React.cloneElement(child, { selected: true });
        }
        return child;
      });
    }

    // otherwise, default to unselected
    return React.Children.map(children, child => {
      if (child.props.value === 'unselected') {
        console.log('defaulting to unselected');
        console.log(React.cloneElement(child, { selected: true }));
        return React.cloneElement(child, { selected: true });
      }
      return child;
    });
  }

  render() {
    const { children, name, size, required, multiple, label, styles = {} } = this.props;
    const { validationMessage, isValid, labelUp } = this.state;

    const labelComponent = label ? (
      <label
        className={styles.prettyLabel || 'form--pretty-label'}
        htmlFor={name}
        data-active={labelUp}
      >
        {label}
      </label>
    ) : null;

    const hiddenStyle = {
      visibility: 'hidden',
      margin: 'unset',
      padding: 'unset',
      height: '0',
    };

    return (
      <div className={styles.prettyRow || 'form--pretty-row'}>
        <div className={styles.prettyInputWrapper || 'form--pretty-input-wrapper'}>
          {labelComponent}
          <select
            className={styles.prettySelect || 'form--pretty-select'}
            name={name}
            required={required}
            size={size}
            multiple={multiple}
            ref={this.inputRef}
            onClick={this.clickHandler}
            onBlur={this.blurHandler}
            onFocus={this.focusHandler}
            defaultValue={this.startingValue}
          // value={this.startingValue}
          >
            <option value="unselected" disabled hidden />
            {children}
          </select>
          <div
            className={styles.prettyValidation || 'form--pretty-validation'}
            data-validity={isValid}
          >
            {validationMessage}
          </div>
        </div>
      </div>
    );
  }
}

FormSelectPretty.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  initialValue: PropTypes.string,
  validator: PropTypes.func,
  validationMessage: PropTypes.string,
};

FormSelectPretty.defaultProps = {
  size: 1,
  required: false,
  multiple: false,
};

module.exports = FormSelectPretty;