const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/not-auth-error');

module.exports = (req, res, next) => {
  try {
    req.user = jwt.verify(req.cookies.jwt, 'some-secret-key');
  } catch (err) {
    throw new NotAuthError('Необходима авторизация');
  }

  next();
};
