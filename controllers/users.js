const bcrypt = require('bcryptjs');

const User = require('../models/user');

const isValidId = (id) => {
  if (id.split('').length === 24) {
    const pattern = /[0-9a-z]{24}/;
    if (pattern.test(id)) {
      return true;
    }
  }
  return false;
};

const getUsers = (req, res) => User.find()
  .then((users) => res.status(200).send(users))
  .catch(() => res.status(500).send({
    message: 'Ошибка сервера',
  }));

const getUserById = (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).send({
      message: 'Передан некорректный ID',
    });
  }
  return User.findById(id)
    .orFail(new Error('Id not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Id not found') {
        return res.status(404).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      return res.status(500).send({
        message: 'Ошибка сервера',
      });
    });
};

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send(user);
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
};

const updateProfile = (req, res) => User.findByIdAndUpdate(req.user._id, {
  $set: {
    name: req.body.name,
    about: req.body.about,
  },
}, {
  returnDocument: 'after',
  runValidators: true,
  new: true,
})
  .then((user) => {
    if (!user) {
      return res.status(404).send({
        message: 'Пользователь не найден',
      });
    }
    const {
      name,
      about,
    } = user;
    return res.status(200).send({
      name,
      about,
    });
  })
  .catch((err) => {
    if ((err.name === 'CastError')) {
      return res.status(400).send({
        message: 'Запрашиваемый пользователь не найден',
      });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: `${Object.values(err.errors).map(() => err.message).join(', ')}`,
      });
    }
    return res.status(500).send({
      message: 'Ошибка сервера',
    });
  });

const updateAvatar = (req, res) => User.findByIdAndUpdate(req.user._id, {
  $set: {
    avatar: req.body.avatar,
  },
}, {
  returnDocument: 'after',
})
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if ((err.name === 'CastError')) {
      return res.status(400).send({
        message: 'Запрашиваемый пользователь не найден',
      });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: `${Object.values(err.errors).map(() => err.message).join(', ')}`,
      });
    }
    return res.status(500).send({
      message: 'Ошибка сервера',
    });
  });

const getCurrentUser = (req, res) => {
  res.send(req.user);
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar, getCurrentUser,
};
