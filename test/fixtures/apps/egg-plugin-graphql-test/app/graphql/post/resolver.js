'use strict';

const data = require('../../mock/data');

module.exports = {
  Query: {
    post: (parent, args) => {
      const { userId } = args;
      return data.post.filter(o => o.userId.toString() === userId);
    },
  },

  Post: {
    author: parent => {
      const { userId } = parent;
      return data.user.find(o => o.id === userId);
    },
  },
};
