'use strict';

const { ApolloServer } = require('apollo-server-koa');
const compose = require('koa-compose');

module.exports = (options, app) => {
  const { typeDefs, resolvers, schemaDirectives } = app.graphql;
  const middleware = [];
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    context: ({ ctx }) => {
      return ctx;
    },
    playground: options.playground,
  });
  apolloServer.applyMiddleware({
    app: {
      // collecting middleware
      use: m => {
        middleware.push(m);
      },
    },
    path: options.router,
  });
  return compose(middleware);
};
