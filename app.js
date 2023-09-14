const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users')
const cardsRouter = require('./routes/cards')
const { PORT = 3000 } = process.env;

const app = express();

// app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '650074aef2d65641febff4b0'
  };

  next();
});

app.use(usersRouter);

app.use(cardsRouter);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
}).then(() => {
  console.log('db connected')
});



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
