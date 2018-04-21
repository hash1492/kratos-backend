let jwt = require('jsonwebtoken');

module.exports = function (req, res, proceed) {    
    if(!req.headers.authorization) {
        return res.forbidden('User is not authorized');
    }

    const token = req.headers.authorization;
    jwt.verify(token, 'MY_SECRET_KEY', function(err, decoded) {
        if(err) {
            return res.forbidden('User is not authorized'); 
        }
        req.userId = decoded.id;
        return proceed();
    });
};