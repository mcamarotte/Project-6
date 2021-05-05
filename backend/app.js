const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();
const path = require('path');
require('dotenv').config();
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user')
const Sauce = require('./models/sauces');
 
//Connect to the Mongo DB database
mongoose.connect(`mongodb+srv://mcamarotte:Ita218.Child.18%2A@cluster0.q6ux1.mongodb.net/project6?retryWrites=true&w=majority`,

{ 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
})

  .then(() => console.log("Connection to MongoDB succesful!"))
  .catch((error) => console.log("Connection to MongoDB failure!",error));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use(mongoSanitize({
  replaceWith: '_'
}))

//make the images publicly accessible for all requests to the route - images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes)

module.exports = app;
