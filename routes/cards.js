const router = require('express').Router();
const { getCards, deleteCardById, createCard, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/', (req,res) => {
  res.send('Helloooooo!')
})

router.get('/cards', getCards)

router.delete('/cards/:id', deleteCardById);

router.post('/cards', createCard);

router.put('/cards/:id/likes', likeCard);

router.delete('/cards/:id/likes', dislikeCard);

module.exports = router;