const cardsRoutes = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const auth = require('../middlewares/auth');
const validateLink = require('../middlewares/validateLink');

const {
  getCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
} = require('../controllers/cards');

cardsRoutes.get('/cards', auth, getCards);

cardsRoutes.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateLink),
  }),
}), createCard);

cardsRoutes.delete('/cards/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteCard);

cardsRoutes.put('/cards/:id/likes', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), setLike);

cardsRoutes.delete('/cards/:id/likes', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteLike);

module.exports = cardsRoutes;
