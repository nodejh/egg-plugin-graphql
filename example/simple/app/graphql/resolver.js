'use strict';

module.exports = {
  Query: {
    say: () => {
      return 'Hello, GraphQL!';
    },

    user: () => {
      return {
        name: 'Jack',
        age: 10,
      };
    },

    users: () => {
      return [
        {
          name: 'Jack',
          age: 10,
        },
        {
          name: 'Joe',
          age: 9,
        },
      ];
    },
  },
};
