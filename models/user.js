const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Имя должно быть не менее 2 букв'],
    maxlength: [30, 'Имя должно быть не более 30 букв'],
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'Должно быть не менее 2 букв'],
    maxlength: [30, 'Должно быть не более 30 букв'],
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
