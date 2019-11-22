'use strict';

const Service = require('egg').Service;
const data = require('../mock/data');


class UserService extends Service {
  findById(id) {
    const user = data.user.find(o => o.id === id);
    return user;
  }

  findAll() {
    const users = data.user;
    return users;
  }
}

module.exports = UserService;
