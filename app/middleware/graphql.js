'use strict';

const { ApolloServer } = require('apollo-server-koa');

module.exports = (options, app) => {
  return async (ctx, next) => {
    if (ctx.request.path === options.router && app.graphqlConfig) {

      const { typeDefs, resolvers } = app.graphqlConfig;
      const server = new ApolloServer({
        typeDefs,
        resolvers,
        playground: options.playground,
      });

      server.applyMiddleware({
        app,
        path: options.router,
        context: ctx,
      });
    }

    await next();
  };
};
