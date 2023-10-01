const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const urlPattern = require('./utils/constants');
const allowedCors = require('./utils/allowedCors');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const login = require('./controllers/login');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
});

app.use(cookieParser());

app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlPattern),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);

app.use(usersRouter);

app.use(cardsRouter);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
