'use strict';

const Service = require('egg').Service;
const data = require('../mock/data');


class PostService extends Service {
  findById(id) {
    const post = data.post.find(o => o.id === id);
    return post;
  }

  find({ userIds }) {
    const posts = data.post.filter(o => userIds.includes(o.userId));
    return posts;
  }
}

module.exports = PostService;
