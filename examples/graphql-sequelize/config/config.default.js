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
  config.keys = appInfo.name + '_1571820663045_7991';

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
      // 是否创建默认的空 schema
      defaultEmptySchema: true,
      // 是否加载开发者工具 (playground), 默认开启, 路由同 router 字段, 使用浏览器打开该可见
      playground: true,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
