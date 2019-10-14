'use strict';


exports.graphql = {
  router: '/graphql',
  // 是否加载到 app 上, 默认开启
  app: true,
  // 是否创建默认的空 schema
  defaultEmptySchema: false,
  // 是否加载开发者工具 (playground), 默认开启, 路由同 router 字段, 使用浏览器打开该可见
  playground: true,
};
