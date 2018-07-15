/**
 * VerificationCodeController
 *
 * @description :: Server-side logic for verification codes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    add: function(verificationCodeObj, cb) {
        console.log("add called");
        
        console.log(verificationCodeObj);
        
        VerificationCode.findOne({userId: verificationCodeObj.userId})
        .then(function (response) {
            console.log(response);
            if(!response) {
                VerificationCode.create(verificationCodeObj)
                .then(function (response) {
                    cb();
                })
                .catch(function (err) {
                    console.log(err)
                    cb();
                })
            } else {
                VerificationCode.update({userId: verificationCodeObj.userId})
                .set({code: verificationCodeObj.code})
                .then(function (response) {
                    cb();
                })
                .catch(function (err) {
                    console.log(err)
                    cb();
                })
            }
        })
        .catch(function (err) {
            console.log(err)
            cb();
        })
    },
    get: function(verificationCodeObj, cb) {
        console.log("get called");
        console.log(verificationCodeObj);
        
        VerificationCode.findOne(verificationCodeObj)
        .then(function(response){
            if(response) {
                cb(true);
            } else {
                cb(false);
            }
        })
        .catch(function(err) {
            console.log(err);
            cb(false);
        })
    }
};