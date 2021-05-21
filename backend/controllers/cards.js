const Card = require('../models/cards');
const NotFoundError = require('../errors/not-found-err');
const InternalServerErr = require('../errors/internal-server-err');
const BadRequestErr = require('../errors/bad-request-err');

exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      throw new InternalServerErr('Ошибка на сервере');
    })
    .catch(next);
};

exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') throw new BadRequestErr('Переданы некорректные данные при создании карточки');
      throw new InternalServerErr('Ошибка на сервере');
    })
    .catch(next);
};

exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (req.user._id !== card.owner.toString()) {
        throw new NotFoundError('Можно удалить только свою карточку!');
      } else {
        Card.findByIdAndRemove(req.params.id)
          .then(() => res.send(card))
          .catch(next);
      }
    })
    .catch(next);
};

exports.setLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      return res.send({ card });
    })
    .catch(next);
};

exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      return res.send({ card });
    })
    .catch(next);
};
