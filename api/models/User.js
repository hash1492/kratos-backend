/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let uuid = require('node-uuid');

module.exports = {
  tableName: 'users',
  attributes: {
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    birthDate: {
      type: 'string',
      required: false,
      defaultsTo: '1000-01-01'
    },
    bio: {
      type: 'string',
      required: false
    },
    gender: {
      type: 'string',
      required: false
    },
    address: {
      type: 'string',
      required: false
    },
    profilePicture: {
      type: 'string',
      required: false
    },
    school: {
      type: 'string',
      required: false
    },
    work: {
      type: 'string',
      required: false
    },
    active: {
      type: 'boolean',
      required: false
    },
    posts: {
      collection: 'post',
      via: 'userId'
    },
    verficationCodes: {
      collection: 'verificationCode',
      via: 'userId'
    },
    friends: {
      collection: 'friend',
      via: 'userId1'
    },
  },
  beforeCreate: function (values, cb) {
    values.id = uuid.v4();
    values.createdAt = new Date();
    values.updatedAt = new Date();
    values.dateJoined = new Date();
    cb();
  },
  beforeUpdate: function (values, cb) {
    values.updatedAt = new Date();
    cb();
  }
};

