/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let uuid = require('node-uuid');

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
          response.token = jwt.sign({id: response.id}, 'MY_SECRET_KEY');

          // Only return required properties
          const responseObj = {
            id: response.id,
            email: response.email,
            active: response.active,
            firstName: response.firstName,
            token: response.token
          };
          return res.send(responseObj)
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
              const responseObj = {
                id: response.id              
              };
              res.send(responseObj);
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
  },
  forgotPassword: function (req, res) {
    let user = req.body;

    console.log(user);
    // Check if user exists
    User.findOne({email: user.email})
    .then(function (response) {
      // user exists, send verfication code
      if(response) {
        let verificationCode = uuid.v4();
        console.log("verification code = " + verificationCode);
        // TODO Send an email to this user with a verification code
        let responseObj = {
          message: 'Verification code sent'
        };
    
        res.send(responseObj);
      } else {
        let errObj = {
          message: 'User with this email does not exist'
        }
        res.serverError(errObj);
      }
    })
    .catch(function (err) {
      console.log(err)
      res.serverError(err);
    })
  },
  verifyUser: function (req, res) {
    let user = req.body;

    console.log("verification code = " + user.verificationCode);
    
    // TODO Check in db if last verification code sent to this email matches this verificationCode value

    // Temp return true if entered code is "123"
    if(verificationCode === '123') {
      let responseObj = {
        message: 'Verification successful'
      };
  
      res.send(responseObj);
    } else {
      let errObj = {
        message: 'Verfication unsuccessful'
      };

      res.serverError(errObj);
    }
  },
  resetPassword: function (req, res) {
    let user = req.body.password;

    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function(err, salt) {
      // Create a hash of the password        
      bcrypt.hash(user.Password, salt, function(err, hash) {
          User.update({id: user.id})
          .set({password: hash})
          .then(function (response) {
            const responseObj = {
              message: 'Password reset successful'              
            };
            res.send(responseObj);
          })
          .catch(function (err) {
            console.log(err)
            res.serverError(err);
          })
      });
    });
  }
};
