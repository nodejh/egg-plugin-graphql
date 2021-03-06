'use strict';

const path = require('path');
const fs = require('fs');
const debug = require('debug')('egg-plugin-graphql');
const { merge } = require('lodash');
const glob = require('glob');


const SYMBOL_GRAPHQL_SCHEMA = Symbol('Application#graphql');

module.exports = app => {
  const { graphql: { defaultEmptySchema = false } } = app.config;
  const basePath = path.join(app.baseDir, 'app/graphql');

  const typeDefsFiles = glob.sync(`${basePath}/**/*.@(gql|graphql|graphqls)`);
  debug('find %d schema files', typeDefsFiles.length);
  const resolverFiles = glob.sync(`${basePath}/**/?(*.)resolver.@(js|ts)`);
  debug('find %d resolver files', resolverFiles.length);
  const schemaDirectivesFiles = glob.sync(`${basePath}/**/?(*.)schemaDirective.@(js|ts)`);
  debug('find %d schemaDirective files', schemaDirectivesFiles.length);

  const typeDefs = [];
  if (defaultEmptySchema) {
    debug('use default empty GraphQL schema');
    typeDefs.push('type Query { _empty: String }');
    typeDefs.push('type Mutation { _empty: String }');
  }

  typeDefsFiles.forEach(file => {
    const schema = fs.readFileSync(file, { encoding: 'utf8' });
    // check if schema is empty string
    if (!/^\s*$/.test(schema)) {
      typeDefs.push(schema);
    }
  });
  debug('load schemas');

  const resolvers = {};
  resolverFiles.forEach(file => {
    const resolver = require(file);
    merge(resolvers, resolver);
  });
  debug('load resolvers');

  const schemaDirectives = {};
  schemaDirectivesFiles.forEach(file => {
    const schemaDirective = require(file);
    merge(schemaDirectives, schemaDirective);
  });
  debug('load schemaDirectives');

  Object.defineProperty(app, 'graphql', {
    get() {
      if (!this[SYMBOL_GRAPHQL_SCHEMA]) {
        this[SYMBOL_GRAPHQL_SCHEMA] = {
          typeDefs,
          resolvers,
          schemaDirectives,
        };
      }
      return this[SYMBOL_GRAPHQL_SCHEMA];
    },
  });

};
