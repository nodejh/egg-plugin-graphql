'use strict';

module.exports = {
  Query: {
    myType: (parent, args) => {
      const { value } = args;
      return { oddValue: value };
    },
    hello: (parent, args) => {
      const { name } = args;
      return `Hello, ${name}!`;
    },
  },
};
