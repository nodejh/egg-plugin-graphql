'use strict';

module.exports = {
  Query: {
    user: (root, params, ctx) => {
      console.log(root);
      console.log(params);
      console.log(ctx);
    },
    users: () => [ 'Jack', 'tom' ],
  },
};
