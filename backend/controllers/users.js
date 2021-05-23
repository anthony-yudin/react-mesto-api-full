const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const InternalServerErr = require('../errors/internal-server-err');
const BadRequestErr = require('../errors/bad-request-err');
const NotAuthError = require('../errors/not-auth-error');
const DoubleEmailError = require('../errors/double-email-error');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      throw new NotAuthError(err.message);
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      throw new InternalServerErr('Ошибка на сервере');
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      return res.send(user);
    })
    .catch(next);
};

exports.getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      return res.send({ user });
    })
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.send({ ...user._doc, password: undefined }))
    .catch((err) => {
      if (err.name === 'ValidationError') throw new BadRequestErr('Переданы некорректные данные при создании пользователя');
      if (err.name === 'MongoError' && err.code === 11000) throw new DoubleEmailError('Пользователь с таким email уже существует');
      throw new InternalServerErr('Ошибка на сервере');
    })
    .catch(next);
};

exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') throw new BadRequestErr('Переданы некорректные данные при обновлении пользователя');
      throw new InternalServerErr('Ошибка на сервере');
    })
    .catch(next);
};

exports.updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') throw new BadRequestErr('Переданы некорректные данные при обновлении аватара пользователя');
      throw new InternalServerErr('Ошибка на сервере');
    })
    .catch(next);
};
