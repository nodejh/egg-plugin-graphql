'use strict';

module.exports = {
  Query: {
    user: async (parent, args, ctx) => {
      const { id } = args;
      return await ctx.service.user.findById(id);
    },

    users: async (parent, args, ctx) => {
      return await ctx.service.user.findAll();
    },
  },
};
