const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const urlPattern = /https?:\/\/(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?:\/\/(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,}/;

const {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', (req, res) => {
  res.send('Helloooooo!');
});

router.get('/cards', getCards);

router.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), deleteCardById);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlPattern),
  }),
}), createCard);

router.put('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), likeCard);

router.delete('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

router.all('*', (req, res) => {
  res.status(404).send({
    message: 'Страница не найдена',
  });
});

module.exports = router;
