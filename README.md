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

Egg Plugin for GraphQL.

[English](README.md) | [中文](README.zh_CN.md)

## Install

```bash
$ npm i egg-plugin-graphql --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.graphql = {
  enable: true,
  package: 'egg-plugin-graphql',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.graphql = {
  router: '/graphql',
  // load on app, default true
  app: true,
  // load on agent, default false
  agent: false,
  // use playground, default true
  playground: true,
};

// add graphql middleware
exports.middleware = [ 'graphql' ];
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

- [ ] TODO

## TODO

- [ ] support connector

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
