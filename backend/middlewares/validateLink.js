const validator = require('validator');

module.exports = (value) => (validator.isURL(value, { require_protocol: true }) ? value : '');
