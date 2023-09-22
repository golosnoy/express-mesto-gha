const jwt = require('jsonwebtoken');
const User = require('../models/user');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // eslint-disable-next-line no-unused-vars
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.status(200).send({ token }).cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
    })
    .catch(() => {
      next();
    });
};

module.exports = login;
