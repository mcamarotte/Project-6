const bcrypt = require('bcrypt');
const webtoken = require('jsonwebtoken');
const cryptojs = require('crypto-js');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    //create hashes user password
  bcrypt.hash(req.body.password, 10)      
      .then(hash => {                     
          const user = new User({         
              email: req.body.email,
              password: hash          
          });
  
      //adds user to database
      user.save()
        .then(() => res.status(201).json({ message: 'User created!' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
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
