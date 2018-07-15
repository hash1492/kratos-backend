/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let uuid = require('node-uuid');
var verificationCodeController = require('./VerificationCodeController');
var friendController = require('./FriendController');

module.exports = {
	login: function (req, res) {
    const user = req.body;
    User.findOne({email: user.email})
    .then(function (response) {
      // User doesn't exist
      if(!response){
        return res.serverError({
          errorCode: 'USER_DOESNT_EXIST',
          message: 'User doesn\'t exist'
        });
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
        return res.serverError({
          errorCode: 'INCORRECT_PASSWORD',
          message: 'Incorrect Password'
        });
      });
    })
    .catch(function (err) {
      console.log(err)
      return res.serverError({
        errorCode: 'LOGIN_FAILED',
        message: 'Login failed',
        err: err
      });
    })
	},
  register: function (req, res) {
    const user = req.body;

    User.findOne({email: user.email})
    .then(function (response) {
      if(response){
        return res.serverError({
          errorCode: 'EXISTING_USER',
          message: 'User already exists'
        });
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
              let emailObj = {
                name: user.firstName,
                email: user.email
              }
              EmailService.sendWelcomeEmail(emailObj);
              res.send(responseObj);
            })
            .catch(function (err) {
              console.log(err)
              return res.serverError({
                errorCode: 'REGISTRATION_FAILED',
                message: 'Registration failed',
                err: err
              });
            })
        });
      });
    })
    .catch(function (err) {
      console.log(err)
      return res.serverError({
        errorCode: 'REGISTRATION_FAILED',
        message: 'Registration failed',
        err: err
      });
    })
  },
  forgotPassword: function (req, res) {
    let user = req.body;
    // Check if user exists
    User.findOne({email: user.email})
    .then(function (response) {
      // user exists, send verfication code
      if(response) {
        let verificationCode = uuid.v4().substr(0,4);
        let verificationCodeObj = {
          code: verificationCode,
          userId: response.id
        };
        verificationCodeController.add(verificationCodeObj, function() {
          // Send an email to this user with a verification code
          let emailObj = {
            email: user.email,
            verificationCode: verificationCode
          };
          EmailService.sendVerifcationCodeEmail(emailObj);
          let responseObj = {
            message: 'Verification code sent'
          };
      
          res.send(responseObj);
        })
      } else {        
        return res.serverError({
          errorCode: 'USER_DOESNT_EXIST',
          message: 'User doesn\'t exist',
        });
      }
    })
    .catch(function (err) {
      console.log(err)
      return res.serverError({
        errorCode: 'FORGOT_PASSWORD_FAILED',
        message: 'Forgot password failed',
        err: err
      });
    })
  },
  verifyUser: function (req, res) {
    let user = req.body;
    
    User.findOne({email: user.email})
    .then(function (userObj) {
      if(userObj) {
        let verificationCodeObj = {
          code: user.verificationCode,
          userId: userObj.id
        };
        verificationCodeController.get(verificationCodeObj, function(verified) {
          if(verified) {
            let responseObj = {
              id: userObj.id,
              message: 'Verification successful'
            };
        
            res.send(responseObj);
          } else {      
            return res.serverError({
              errorCode: 'VERIFICATION_FAILED',
              message: 'Verfication unsuccessful'
            });
          }
        })
      } else {
        return res.serverError({
          errorCode: 'USER_DOESNT_EXIST',
          message: 'User with this email does not exist'
        });
      }
    })
  },
  resetPassword: function (req, res) {
    let user = req.body;

    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function(err, salt) {
      // Create a hash of the password        
      bcrypt.hash(user.password, salt, function(err, hash) {
          User.update({id: user.id})
          .set({password: hash})
          .then(function (response) {
            console.log(response);
            if(!response.length) {
              return res.serverError({
                errorCode: 'USER_DOESNT_EXIST',
                message: 'User with this email does not exist',
                err: err
              });
            }
            
            const responseObj = {
              message: 'Password reset successful'              
            };
            res.send(responseObj);
          })
          .catch(function (err) {
            console.log(err)
            return res.serverError({
              errorCode: 'USER_DOESNT_EXIST',
              message: 'User with this email does not exist',
              err: err
            });
          })
      });
    });
  },
  search: function (req, res) {
    let searchObj = req.body;

    User.find({
      or: [
        {
          firstName: {
            contains: searchObj.text
          } 
        },
        {
          lastName: {
            contains: searchObj.text
          } 
        },
        { 
          email: {
            contains: searchObj.text
          }
        }
      ]
    })
    .populate('friends')
    .then(function (users) {
      if(!users || !users.length) {
        return res.serverError({
          errorCode: 'NO_USERS_FOUND',
          message: 'No user was found matching this name',
        });
      }
      let promises = [];
      users.forEach(user => {
        if(user.id === req.userId) {
          user.isMyProfile = true
        }
        promises.push(friendController.isUserMyFriend(user, req.userId))
      })

      Promise.all(promises)
      .then(function(responses) {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          for (let j = 0; j < responses.length; j++) {
            const response = responses[j];
            if(i === j ) { 
              user.isFriend = response;
            }
          }
        }
        res.send(users);
      })
      .catch(function (err) {
        console.log(err);
      })
    })
    .catch(function (err) {
      console.log(err)
      return res.serverError({
        errorCode: 'NO_USERS_FOUND',
        message: 'No user was found matching this name',
        err: err
      });
    })
  }
};
