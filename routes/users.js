const router = require('express').Router();

const {
  getUsers, getUserById, updateProfile, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', (req, res) => {
  res.send('Hello!');
});

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.get('/users/:id', getUserById);

router.patch('/users/me', updateProfile);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
