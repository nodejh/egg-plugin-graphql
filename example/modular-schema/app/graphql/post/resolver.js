'use strict';

module.exports = {
  Query: {
    post: (parent, args, ctx) => {
      const { id } = args;
      return ctx.service.post.findById(id);
    },
    posts: (parent, args, ctx) => {
      const { userIds } = args;
      return ctx.service.post.find({ userIds });
    },
  },

  Post: {
    user: (parent, args, ctx) => {
      const { userId } = parent;
      return ctx.service.user.findById(userId);
    },
  },
};
