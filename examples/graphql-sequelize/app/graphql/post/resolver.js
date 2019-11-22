'use strict';

module.exports = {
  Query: {
    post: async (parent, args, ctx) => {
      const { id } = args;
      return await ctx.service.post.findById(id);
    },
    posts: async (parent, args, ctx) => {
      const { userIds } = args;
      return await ctx.service.post.find({ userIds });
    },
  },

  Post: {
    user: async (parent, args, ctx) => {
      const { userId } = parent;
      return await ctx.service.user.findById(userId);
    },
  },

  Mutation: {
    post: async (parent, args, ctx) => {
      console.log('parent', parent);
      console.log('args', args);
      return 102;
    },
  },
};
