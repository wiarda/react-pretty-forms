import validator from 'validator';

// validation helpers

export function isValidEmail(value) {
  return validator.isEmail(value);
}

export function isValidEntry(value) {
  return String(value).length >= 1;
}

/**
 * returns validation message if invalid, or false if valid
 * @param {*} name
 * @param {*} required
 * @param {*} value
 */
export function defaultValidator(name, value, required = false) {
  switch (name) {
    case 'email':
      return isValidEmail(value);
    default:
      if (required) return isValidEntry(value);
      return true;
  }
}

export function selectDefaultValidityMessage(name, required) {
  const INVALID_EMAIL = 'Please enter a valid email address';
  const INVALID_ENTRY = 'Please fill in this required field';
  const INVALID_CHECK = 'Please click to accept';
  switch (name) {
    case 'email':
      return INVALID_EMAIL;
    case 'checkbox':
      if (required) return INVALID_CHECK;
      break;
    default:
      if (required) return INVALID_ENTRY;
  }
  return '';
}
