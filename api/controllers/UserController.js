/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

module.exports = {
	login: function (req, res) {
    const user = req.body;
    User.findOne({email: user.email})
    .then(function (response) {
      // User doesn't exist
      if(!response){
        return res.serverError('User doesnt exist')
      }

      // User exists, check password
      bcrypt.compare(user.password, response.password, function(err, result) {
        if(result) {
          // Generate jwt token
          response.token = jwt.sign({id: response.id}, 'MY_SECRET_KEY')
          return res.send(response)
        }
        return res.serverError('Incorrect Password');
      });
    })
    .catch(function (err) {
      console.log(err)
      res.send(err)
    })
	},
  register: function (req, res) {
    const user = req.body;

    User.findOne({email: user.email})
    .then(function (response) {
      if(response){
        return res.serverError('User already exists');
      }
      
      const saltRounds = 10;

      bcrypt.genSalt(saltRounds, function(err, salt) {
        // Create a hash of the password        
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            User.create(user)
            .then(function (response) {
              res.send(response);
            })
            .catch(function (err) {
              console.log(err)
              res.send(err)
            })
        });
      });
    })
    .catch(function (err) {
      console.log(err)
      res.send(err)
    })
  }
};
