/**
 * FriendRequestController
 *
 * @description :: Server-side logic for friend requests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    add: function(req, res) {
        let friendRequestObj = req.body;
        friendRequestObj.requestingUserId = req.userId;
        friendRequestObj.status = 'pending';
        console.log(friendRequestObj);
        
        FriendRequest.create(friendRequestObj)
        .then(function (response) {      
            console.log(response);
            res.send(response);
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
    },
    get: function(req, res) {
        let userId = req.userId;
        FriendRequest.find({userId: userId, status: 'pending'})
        .populate('requestingUserId')
        .then(function (response) {      
            console.log(response);
            let userRequests = [];
            response.forEach(request => {
                let requestObj = {
                    id: request.id,
                    user: request.requestingUserId,
                    createdAt: request.createdAt
                };
                userRequests.push(requestObj);
            })
            res.send(userRequests);
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
    },
    accept: function(req, res) {
        let friendrequestId = req.body.friendrequestId;
        FriendRequest.update({id: friendrequestId})
        .set({status: 'accepted'})
        .then(function (response) {
            const responseObj = {
                message: 'Friend request accepted'              
            };
            res.send(responseObj);
        })
        .catch(function (err) {
            console.log(err)
        })
    },
    decline: function(req, res) {
        let friendrequestId = req.body.friendrequestId;
        FriendRequest.update({id: friendrequestId})
        .set({status: 'declined'})
        .then(function (response) {
            const responseObj = {
                message: 'Friend request declined'              
            };
            res.send(responseObj);
        })
        .catch(function (err) {
            console.log(err)
        })
    }
};