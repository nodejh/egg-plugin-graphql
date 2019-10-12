'use strict';


module.exports = (options, app) => {
  return async (ctx, next) => {
    if (ctx.request.path === options.router && app.graphqlServer) {
      app.graphqlServer.applyMiddleware({ app, path: options.router });
    }

    await next();
  };
};
