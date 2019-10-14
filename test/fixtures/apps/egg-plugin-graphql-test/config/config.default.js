'use strict';

exports.keys = '123456';

exports.graphql = {
  router: '/graphql',
  app: true,
  defaultEmptySchema: true,
  playground: true,
};

exports.middleware = [ 'graphql' ];
