'use strict';

const { graphqlKoa } = require('apollo-server-koa/dist/koaApollo');
const {
  renderPlaygroundPage,
} = require('@apollographql/graphql-playground-html');

module.exports = (options, app) => {
  return async (ctx, next) => {
    if (ctx.request.path === options.router && app.schema) {
      if (ctx.request.method === 'OPTIONS') {
        ctx.status = 204;
        ctx.body = '';
        return;
      }

      if (
        ctx.request.accepts([ 'json', 'html' ]) === 'html' &&
        options.playground
      ) {
        ctx.set('Content-Type', 'text/html');
        const playground = renderPlaygroundPage({
          endpoint: options.router,
          settings: {
            'request.credentials': 'include',
          },
        });
        ctx.body = playground;
        return;
      }

      return graphqlKoa({
        schema: app.schema,
        context: ctx,
      })(ctx, next);
    }

    await next();
  };
};
