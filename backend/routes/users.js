const usersRoutes = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getUser,
  getUsers,
  getUserId,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

usersRoutes.get('/users/me', auth, getUser);
usersRoutes.get('/users', auth, getUsers);
usersRoutes.get('/users/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).pattern(new RegExp('^[0-9]{8,}$')),
  }),
}), getUserId);

usersRoutes.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

usersRoutes.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateUserAvatar);

module.exports = usersRoutes;
