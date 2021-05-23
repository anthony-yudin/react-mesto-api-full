const cardsRoutes = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const auth = require('../middlewares/auth');

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
    link: Joi.string().required().pattern(new RegExp(/^(https?:\/\/)(www.)?(([\da-z-])+.)*\w{2,6}(\/[\da-z-]+)*(.[a-z]{1,4})?\/?#?$/)),
  }),
}), createCard);

cardsRoutes.delete('/cards/:id', auth, deleteCard);

cardsRoutes.put('/cards/likes/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24),
  }),
}), setLike);

cardsRoutes.delete('/cards/likes/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24),
  }),
}), deleteLike);

module.exports = cardsRoutes;
