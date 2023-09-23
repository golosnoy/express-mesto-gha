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

router.delete('/cards/:id', deleteCardById);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(urlPattern),
  }),
}), createCard);

router.put('/cards/:id/likes', likeCard);

router.delete('/cards/:id/likes', dislikeCard);

router.all('*', (req, res) => {
  res.status(404).send({
    message: 'Страница не найдена',
  });
});

module.exports = router;
