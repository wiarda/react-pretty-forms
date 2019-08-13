function isValidEmail(value) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
}

function isValidEntry(value) {
  return String(value).length >= 1;
}

/**
 * returns validation message if invalid, or false if valid
 * @param {*} name
 * @param {*} required
 * @param {*} value
 */
function defaultValidator(name, value, required = false) {
  switch (name) {
    case 'email':
      return isValidEmail(value);
    default:
      if (required) return isValidEntry(value);
      return true;
  }
}

function selectDefaultValidityMessage(name, required) {
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

module.exports = {
  isValidEmail, isValidEntry, defaultValidator, selectDefaultValidityMessage,
};
