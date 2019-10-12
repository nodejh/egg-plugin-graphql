'use strict';

const path = require('path');
const { ApolloServer } = require('apollo-server-koa');
const {
  fileLoader,
  mergeTypes,
  mergeResolvers,
} = require('merge-graphql-schemas');


const SYMBOL_SERVER = Symbol('Application#graphqlServer');

module.exports = app => {

  Object.defineProperty(app, 'graphqlServer', {
    get() {
      if (!this[SYMBOL_SERVER]) {

        const typesArray = fileLoader(
          path.join(app.baseDir, './app/graphql/**/*.graphql')
        ).filter(o => typeof o === 'string');

        if (typesArray.length === 0) {
          app.coreLogger.error('GraphQL Schema Not Found!');
          return null;
        }

        app.coreLogger.warn('Find %d schema files', typesArray.length);
        const typeDefs = mergeTypes(typesArray, { all: true });

        const resolversArray = fileLoader(
          path.join(app.baseDir, './app/graphql/**/*resolver.*')
        ).filter(o => typeof o === 'object');

        if (resolversArray.length === 0) {
          app.coreLogger.error('GraphQL Schema Not Found!');
          return null;
        }
        app.coreLogger.warn('Find %d resolver files', resolversArray.length);
        const resolvers = mergeResolvers(resolversArray);

        const server = new ApolloServer({
          typeDefs,
          resolvers,
          playground: app.config.playground,
        });

        this[SYMBOL_SERVER] = server;
      }
      return this[SYMBOL_SERVER];
    },
  });
};
