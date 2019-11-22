/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1571300208244_3025';

  // add your middleware config here
  config.middleware = [ 'graphql' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    security: {
      csrf: {
        enable: false,
        ignoreJSON: false,
      },
    },

    graphql: {
      router: '/graphql',
      defaultEmptySchema: false,
      playground: true,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
