const webtoken = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; 
    //retrieving the token from the authorisation header and check the user credentials
    const decodedToken = webtoken.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID is not valid !';
    } else {
      User.findOne({ _id: userId })
        .then(user => {
          req.user = user;
          next();
        })
    }
  } catch(error) {
    res.status(401).json({
      error: new Error('Unauthenticated request!')
    });
  }
};