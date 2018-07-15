/**
 * FriendController
 *
 * @description :: Server-side logic for friends
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    add: function(req, res) {
        let friendObj = req.body;
        friendObj.userId2 = req.userId;
        console.log(friendObj);
        
        Friend.create(friendObj)
        .then(function (response) {      
            res.send(response);
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
    },
    isUserMyFriend: function(user, currentUserId) {

        return Friend.findOne({
            or : [
                { userId1: user.id, userId2: currentUserId },
                { userId1: currentUserId, userId2: user.id } 
            ]
        })
        .then(function (response) {
            console.log(response);
            
            if(response) {
                return true;
            } 
            return false;
        })
        .catch(function (err) {
            console.log(err)
            return false;
        })
    },
    getMyFriends: function(req, res) {
        let userId = req.userId;
        Friend.find({
            or : [
                { userId1: userId },
                { userId2: userId }
            ]
        })
        .populateAll()
        .then(function (friends) {
            let finalFriends = [];
            if(friends.length) {
                friends.forEach(function (friend) {
                    let friendObj = friend;
                    if(friend.userId1.id === userId) {
                        friendObj.user = friend.userId2;
                    } else if(friend.userId2.id === userId) {
                        friendObj.user = friend.userId1;
                    }
                    delete friendObj.userId1;
                    delete friendObj.userId2;
                    finalFriends.push(friendObj);
                })
            }
            res.send(finalFriends);
        })
        .catch(function (err) {
            console.log(err)
            res.send(err);
        })
    },
    unfriend: function(req, res) {
        let friendship = req.body;
        let userId = req.userId;
        Friend.destroy({id: friendship.id})
        .then(function (friends) {
            console.log(friends);
            res.send(friends);
        })
        .catch(function (err) {
            console.log(err)
            res.send(err);
        })
    }
};