/**
 * Post.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let uuid = require("node-uuid");

module.exports = {
  tableName: 'posts',
  attributes: {
    message: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      required: true
    },
    userId: {
      model: 'user'
    },
    photo: {
      type: 'string',
      required: false,
      defaultsTo: ''
    },
    likes: {
      type: 'number',
      defaultsTo: 0
    }
  },
  beforeCreate: function (values, cb) {
    values.id = uuid.v4();
    values.createdAt = new Date();
    values.updatedAt = new Date();
    cb();
  },
  beforeUpdate: function (values, cb) {
    values.updatedAt = new Date();
    cb();
  }
};

