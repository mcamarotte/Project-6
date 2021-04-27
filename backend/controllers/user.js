const bcrypt = require('bcrypt');
const webtoken = require('jsonwebtoken');
const cryptojs = require('crypto-js');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  //require a strong password of at least 8 characters  
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{8,}$/; 
  const password = req.body.password;
  const crypEmail = cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_ENCRYPTION_KEY).toString();

  if (password.match(regex)) {
  //create hashes user password
  bcrypt.hash(password, 10)
    .then(hash => {
      const user = new User({
        email: crypEmail,
        password: hash
      });
      //adds user to database
      user.save()
        .then(() => res.status(201).json({ message: 'User created!' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  } else {
    throw new Error("Password is not secure enough");
  }
};

exports.login = (req, res, next) => {
  const crypEmail = cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_ENCRYPTION_KEY).toString();
  User.findOne({ email: crypEmail })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'User not found!' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Incorrect password!' });
          }
          res.status(200).json({
            //return the user's ID from the database and signed JSON web token containing the user ID            
            userId: user._id,
            token: webtoken.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
