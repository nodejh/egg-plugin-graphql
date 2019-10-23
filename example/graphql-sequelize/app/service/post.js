'use strict';

const Service = require('egg').Service;
const data = require('../mock/data');


class PostService extends Service {
  async findById(id) {
    const post = await data.post.find(o => o.id === id);
    return post;
  }

  async find({ userIds }) {
    const posts = await data.post.filter(o => userIds.includes(o.userId));
    return posts;
  }
}

module.exports = PostService;
