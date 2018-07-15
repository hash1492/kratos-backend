/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createPost: function(req, res) {
    const post = req.body;
    post.userId = req.userId;

    Post.create(post)
    .then(function (response) {      
      res.send(response);
    })
    .catch(function (err) {
      console.log(err)
      res.send(err)
    })
  },
  updatePost: function(req, res) {
    const postId = req.params;
    const post = req.body;

    Post.update({id: postId})
    .set(post)
    .then(function (response) {      
      res.send(response);
    })
    .catch(function (err) {
      console.log(err)
      res.send(err)
    })
  },
  deletePost: function(req, res) {
    const postId = req.params;

    Post.delete({id: postId})
    .then(function (response) {      
      res.send(response);
    })
    .catch(function (err) {
      console.log(err)
      res.send(err)
    })
  },
  getTimelinePosts: function(req, res) {
    const userId = req.params;
    const pagination = req.query;

    pagination.limit = pagination.limit || 10;
    pagination.skip = pagination.skip || 0;
    
    Post.find({
      or : [
        { userId: userId },
        { receiverUserId: userId }
      ],
      limit: pagination.limit, skip: pagination.skip
    })
    .sort('updatedAt DESC')
    .then(function (response) {
      res.send(response);
    })
    .catch(function (err) {
      console.log(err)
      res.send(err)
    })
  },
  getFeedPosts: function(req, res) {
    const userId = req.params;
    const pagination = req.query;

    pagination.limit = pagination.limit || 10;
    pagination.skip = pagination.skip || 0;

    // get list of friends of current user
    Friends.find({
      or : [
        { userId1: userId },
        { userId2: userId }
      ],
    })
    .then(function (friends) {
      const friendsIds = friends.map(friend => {
        if(friend.userId1 === userId){
          return friend.userId2;
        }
        return friend.userId1;
      })


      const posts = [];
      friendsIds.forEach(friendId => {
        Post.find({
          or : [
            { userId: userId },
            { receiverUserId: userId }
          ]
        })
        .then(function (response) {
          posts.push(response);
          // res.send(response);
        })
        .catch(function (err) {
          console.log(err)
          res.send(err)
        })
      })
    })
    .catch(function (err) {
      console.log(err)
      res.send(err)
    })


  },
};

