const Card = require('../models/card');

const isValidId = (id) => {
  if (id.split('').length === 24) {
    const pattern = /[0-9a-z]{24}/;
    if (pattern.test(id)) {
      return true;
    }
  }
  return false;
};

const getCards = (req, res) => Card.find()
  .then((cards) => res.status(200).send(cards))
  .catch(() => res.status(500).send({
    message: 'Ошибка сервера',
  }));

const deleteCardById = (req, res, next) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).send({
      message: 'Передан некорректный ID',
    });
  }
  return Card.findById(id)
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Карточка не найдена',
        });
      }
      const cardOwner = card.owner.toString();
      if (cardOwner === req.user._id) {
        return Card.findByIdAndDelete(id)
          .then(() => res.status(200).send(card));
      }
      return res.status(403).send({
        message: 'Вы не автор карточки',
      });
    })
    .catch(next);
};

const createCard = (req, res) => Card.create({ ...req.body, owner: req.user._id }).then((card) => {
  res.status(201).send(card);
})
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: `${Object.values(err.errors).map(() => err.message).join(', ')}`,
      });
    }
    return res.status(500).send({
      message: 'Ошибка сервера',
    });
  });

const likeCard = (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).send({
      message: 'Передан некорректный ID',
    });
  }
  return Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Карточка не найдена',
        });
      }
      return res.status(200).send(card);
    })
    .catch(() => res.status(500).send({
      message: 'Ошибка сервера',
    }));
};

const dislikeCard = (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).send({
      message: 'Передан некорректный ID',
    });
  }
  return Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Карточка не найдена',
        });
      }
      return res.status(200).send(card);
    })
    .catch(() => res.status(500).send({
      message: 'Ошибка сервера',
    }));
};

module.exports = {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
};
