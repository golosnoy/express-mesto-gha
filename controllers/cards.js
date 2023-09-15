const Card = require('../models/card');

const validateId = (id) => {
  if (id.split('').length === 24) {
    const pattern = /[0-9a-z]{24}/;
    if (pattern.test(id)) {
      return true
    }
  } else {
    return false
  }
}

const getCards = (req,res) => {
  return Card.find()
    .then((cards) => {
      return res.status(200).send(cards);
    })
    .catch(() => res.status(500).send({
      "message": "Ошибка сервера"
    }));
}

const deleteCardById = (req, res) => {
  const {id} = req.params;
  console.log(id)
  if (!validateId(id)) {
    return res.status(400).send({
      "message": "Передан некорректный ID"
    })
  }
  return Card.findByIdAndDelete(id)
    .then((answer) => {
      console.log(answer)
      if (!answer) {
        return res.status(404).send({
          "message": "Карточка не найдена"
        })
      }
      return res.status(200).send(answer);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        return res.status(404).send({
          "message": "Карточка не найдена"
        })
      }
      return res.status(500).send({
        "message": "Ошибка сервера"
      })
    });
}

const createCard = (req,res) => {
  return Card.create({...req.body})
  .then((card) => {
    res.status(201).send(card)
  })
  .catch((err) => {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: `${Object.values(err.errors).map((err) => err.message).join(", ")}`
      })
    }
    return res.status(500).send({
      "message": "Ошибка сервера"
    })
  })
}

const likeCard = (req, res) => {
  const {id} = req.params;
  if (!validateId(id)) {
    return res.status(400).send({
      "message": "Передан некорректный ID"
    })
  }
  return Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card) {
      return res.status(404).send({
        "message": "Карточка не найдена"
      })
    }
    return res.status(200).send(card)
  })
  .catch((err) => {
    console.log(err)
    return res.status(500).send({
      "message": "Ошибка сервера"
    })
  })
}

const dislikeCard = (req, res) => {
  const {id} = req.params;
  if (!validateId(id)) {
    return res.status(400).send({
      "message": "Передан некорректный ID"
    })
  }
  Card.findByIdAndUpdate(
  id,
  { $pull: { likes: req.user._id } },
  { new: true },
)
.then((card) => {
  if (!card) {
    return res.status(404).send({
      "message": "Карточка не найдена"
    })
  }
  return res.status(200).send(card)
})
.catch((err) => {
  console.log(err)
  return res.status(500).send({
    "message": "Ошибка сервера"
  })
})
}

module.exports = { getCards, deleteCardById, createCard, likeCard, dislikeCard }