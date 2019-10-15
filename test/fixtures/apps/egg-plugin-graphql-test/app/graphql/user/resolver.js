'use strict';

const data = require('../../mock/data');


module.exports = {
  Query: {
    user: (parent, args) => {
      const { name } = args;
      return data.user.find(o => o.name === name);
    },
    users: () => {
      return data.user;
    },
  },
};
