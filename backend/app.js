const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const { Joi, celebrate, errors } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');

const { PORT = 3005 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const allowedCors = [
  'https://mestofull.nomoredomains.icu',
  'https://mestofull-backend.nomoredomains.club',
  'http://mestofull.nomoredomains.icu',
  'http://mestofull-backend.nomoredomains.club',
  'http://localhost:3005',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: allowedCors,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowHeaders: ['Content-type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With']
}));
app.use(express.json());
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(/^(https?:\/\/)(www.)?(([\da-z-])+.)*\w{2,6}(\/[\da-z-]+)*(.[a-z]{1,4})?\/?#?$/)),
  }),
}), createUser);

app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.all('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  if (err.kind === 'ObjectId') {
    res.status(400).send({ message: 'Неверный формат id' });
  } else {
    res.status(statusCode).send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  }

  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
