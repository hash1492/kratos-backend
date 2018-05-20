/**
 * Verification.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let uuid = require("node-uuid");

module.exports = {
  tableName: 'verification_codes',
  attributes: {
    userId: {
        model: 'user'
    },
    code: {
      type: 'string',
      required: true
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

