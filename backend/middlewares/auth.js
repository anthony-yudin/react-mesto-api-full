const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/not-auth-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.send(req.headers);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    throw new NotAuthError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
