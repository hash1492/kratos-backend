/**
 * FriendRequest.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let uuid = require("node-uuid");

module.exports = {
  tableName: 'friend_requests',
  attributes: {
    userId: {
      model: 'user'
    },
    requestingUserId: {
        model: 'user'
    },
    status: {
      type: 'string',
      defaultsTo: 'pending'
    }
  },
  beforeCreate: function (values, cb) {
    values.id = uuid.v4();
    values.createdAt = new Date();
    cb();
  },
//   beforeUpdate: function (values, cb) {
//     values.updatedAt = new Date();
//     cb();
//   }
};

