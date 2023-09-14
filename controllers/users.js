const User = require('../models/user');

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

const getUsers = (req,res) => {
  return User.find()
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch(() => res.status(500).send({
      "message": "Ошибка сервера"
    }));
}

const getUserById = (req, res) => {
  const {id} = req.params;
  if (!validateId(id)) {
    return res.status(400).send({
      "message": "Передан некорректный ID"
    })
  }
  return User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          "message": "Запрашиваемый пользователь не найден"
        })
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        "message": "Ошибка сервера"
      })
    });
  }

const createUser = (req,res) => {
  return User.create({...req.body})
  .then((user) => {
    res.status(200).send(user)
  })
  .catch((err) => {
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

const updateProfile = (req,res) => {
  return User.findByIdAndUpdate(req.user._id, { $set: { name: req.body.name }}, {
    returnDocument: 'after',
    runValidators: true,
    new: true
  })
  .then((user) => {
    return res.status(200).send(user);
  })
  .catch((err) => {
    if ((err.name === 'CastError')) {
      return res.status(404).send({
        "message": "Запрашиваемый пользователь не найден"
      })
    }
    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: `${Object.values(err.errors).map((err) => err.message).join(", ")}`
      })
    }
    return res.status(500).send({
      "message": "Ошибка сервера"
    })
  });
}

const updateAvatar = (req,res) => {
  const id = req.body._id;
  console.log(id)
  return User.findByIdAndUpdate(id, { $set: { avatar: req.body.avatar }}, { returnDocument: 'after' })
  .then((user) => {
    return res.status(200).send(user);
  })
  .catch((err) => {
    if ((err.name === 'CastError')) {
      return res.status(404).send({
        "message": "Запрашиваемый пользователь не найден"
      })
    }
    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: `${Object.values(err.errors).map((err) => err.message).join(", ")}`
      })
    }
    return res.status(500).send({
      "message": "Ошибка сервера"
    })
  });
}

module.exports = { getUsers, getUserById, createUser, updateProfile, updateAvatar }