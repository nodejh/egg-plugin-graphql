# egg-plugin-graphql

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-plugin-graphql.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-plugin-graphql
[travis-image]: https://img.shields.io/travis/eggjs/egg-plugin-graphql.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-plugin-graphql
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-plugin-graphql.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-plugin-graphql?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-plugin-graphql.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-plugin-graphql
[snyk-image]: https://snyk.io/test/npm/egg-plugin-graphql/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-plugin-graphql
[download-image]: https://img.shields.io/npm/dm/egg-plugin-graphql.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-plugin-graphql


Egg GraphQL 插件。

- 简单易用
- 支持模块化 GraphQL Schema
- 内置 Apollo Playground
- 支持子 Schema


## 安装

```bash
$ npm i egg-plugin-graphql --save
```


## 开启插件

```js
// config/plugin.js
exports.graphql = {
  enable: true,
  package: 'egg-plugin-graphql',
};
```


## 详细配置

```js
exports.graphql = {
  router: '/graphql',
  // 是否创建默认的空 schema
  defaultEmptySchema: false,
  // 是否加载开发者工具 (playground), 默认开启, 路由同 router 字段, 使用浏览器打开该可见
  playground: true,
};
```

请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。



## Example

- [ ] TODO

## 提问交流

请到 [issues](https://github.com/nodejh/egg-plugin-graphql/issues) 异步交流。

## License

[MIT](LICENSE)
