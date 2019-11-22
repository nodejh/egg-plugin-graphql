'use strict';

const Service = require('egg').Service;
const data = require('../mock/data');


class UserService extends Service {
  async findById(id) {
    const user = await data.user.find(o => o.id === id);
    return user;
  }

  async findAll() {
    const users = await data.user;
    return users;
  }
}

module.exports = UserService;
