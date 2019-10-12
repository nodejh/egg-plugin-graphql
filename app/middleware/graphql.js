'use strict';

const { ApolloServer, gql } = require('apollo-server-koa');

module.exports = (options, app) => {
  console.log('options', options);
  console.log('app', app);

  return async (ctx, next) => {
    console.log('ctx.request.path', ctx.request.path);


    // Construct a schema, using GraphQL schema language
    const typeDefs = gql`
      type Query {
        "xxxxx"
        hello(
          "aaa"
          a: Int
        ): String
      }
    `;

    // Provide resolver functions for your schema fields
    const resolvers = {
      Query: {
        hello: () => 'Hello world!',
      },
    };

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      // playground: false,
    });
    console.log('ctx', ctx);
    console.log('app', app.use);
    server.applyMiddleware({ app });
    await next();
  };
};
