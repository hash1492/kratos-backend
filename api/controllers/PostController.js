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
  }
};

