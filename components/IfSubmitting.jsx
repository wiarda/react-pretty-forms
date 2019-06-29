const React = require('react');
const createFormStatusWrapper = require('./helpers/createFormStatusWrapper');

module.exports = React.memo(createFormStatusWrapper('submitting'));