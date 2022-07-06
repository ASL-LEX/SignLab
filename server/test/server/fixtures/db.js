'use strict';

const AuthAttempt = require('../../../src/models/auth-attempt');
const Backup = require('../../../src/models/backup');
const Feedback = require('../../../src/models/feedback');
const Invite = require('../../../src/models/invite');
const Session = require('../../../src/models/session');
const Token = require('../../../src/models/token');
const User = require('../../../src/models/user');

class Db {
  static async removeAllData() {

    return await Promise.all([
      AuthAttempt.deleteMany({}),
      Backup.deleteMany({}),
      Feedback.deleteMany({}),
      Invite.deleteMany({}),
      Session.deleteMany({}),
      Token.deleteMany({}),
      User.deleteMany({})
    ]);
  }
}

module.exports = Db;
