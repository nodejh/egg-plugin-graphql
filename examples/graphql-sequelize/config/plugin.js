'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  graphql: {
    enable: true,
    package: 'egg-plugin-graphql',
  },
};
