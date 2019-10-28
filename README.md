# egg-plugin-graphql

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-plugin-graphql.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-plugin-graphql
[travis-image]: https://img.shields.io/travis/nodejh/egg-plugin-graphql.svg?style=flat-square
[travis-url]: https://travis-ci.org/nodejh/egg-plugin-graphql
[codecov-image]: https://img.shields.io/codecov/c/github/nodejh/egg-plugin-graphql.svg?style=flat-square
[codecov-url]: https://codecov.io/github/nodejh/egg-plugin-graphql?branch=master
[david-image]: https://img.shields.io/david/nodejh/egg-plugin-graphql.svg?style=flat-square
[david-url]: https://david-dm.org/nodejh/egg-plugin-graphql
[snyk-image]: https://snyk.io/test/npm/egg-plugin-graphql/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-plugin-graphql
[download-image]: https://img.shields.io/npm/dm/egg-plugin-graphql.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-plugin-graphql


Egg GraphQL 插件。


## 使用方法

### 安装

```bash
$ npm i egg-plugin-graphql --save
```


### 开启插件

```js
// config/plugin.js
exports.graphql = {
  enable: true,
  package: 'egg-plugin-graphql',
};
```

### 配置


```js
// config.default.js

// 配置 graphql
exports.graphql = {
  router: '/graphql',
  // 是否创建默认的空 schema
  defaultEmptySchema: false,
  // 是否加载开发者工具 (playground), 默认开启, 路由同 router 字段, 使用浏览器打开该可见
  playground: true,
};

// 使用 graphql 插件，拦截请求
exports.middleware = [ 'graphql' ];
```


## Example

- [example/simple](example/simple/) 一个简单的例子
- [example/modular-schema](example/modular-schema/) 模块化 schema

## 提问交流

请到 [issues](https://github.com/nodejh/egg-plugin-graphql/issues) 异步交流。

## License

[MIT](LICENSE)


---

# 基于 Node.js 的 GraphQL 实践


## 前言

作为前端，你一定很痛恨接口文档写的很差，你一定很抱怨接口字段冗余，你一定很讨厌要请求多个接口才能得到想要的数据。作为后端，你一定很痛恨写接口文档，你一定很会抱怨为什么前端不自己去取想要的值，你一定讨厌前端对你的接口指指点点。

如何解决前后端的分歧？如何提高开发效率？那就是 GraphQL。

GraphQL 是一个 API 查询语言，跟 RESTful API 是同一类的技术。换句话说，GraphQL 是一个可以替代 RESTful API 的产品。

接下来本文就详细介绍一下基于 Node.js 的 GraphQL 实践。

相关技术栈：

- 后端： [Egg.js](https://eggjs.org/)
- GraphQL Server: [apollo-server](https://github.com/apollographql/apollo-server)
- Egg 中的 GraphQL 插件：[egg-plugin-graphql](https://github.com/nodejh/egg-plugin-graphql)
- 前端：[react-apollo](https://github.com/apollographql/react-apollo)

## GraphQL 简介

相信大家都已经了解，Egg.js 应用一般都是是经典的 MVC 模式：

- `router` （路由）
- `controller`
- `service`
- `public` （view）

我们一般会在 `router`  中定义接口，也就是 RESTful API 中的路由，如 `router.get('/api/user', controller.user.index)`，然后在 `controller` 控制器的逻辑，一般是参数校验、权限控制、调用 `service` 以及返回结果。`service` 中则是业务的具体实现，比如操作数据库等。

而当我们在 Egg.js 中使用 GraphQL 的时候，替代的则是 `controller`。因为 GraphQL 已经帮我们实现了路由和参数校验，并且我们可以在 GraphQL 中进行服务（`service`）的调用。

那么 GraphQL 是怎么实现的呢？这就需要引出 GraphQL 的两个概念：`schema` 和 `resolver`。

### Schema

Schema 是 GraphQL 中对数据的描述，与 TypeScript 中的类型定义有点类似。举个例子：

```js
enum Gender {
  MALE
  FEMALE
  NONE
}

type User {
  name: String!
  gender: Gender!
  tags: [String!]!
}
```

如上所示，`Gender` 是一个枚举类型，它的值是 MALE、FEMALE 和 NONE 之一。

User 是一个 GraphQL 对象类型，拥有 `name` 和 `tags` 两个字段。其中 `name` 的类型是 `String!`，`!` 表示这个字段是非空的。`[String!]!` 表示一个 String 数组，这个数组内元素非空，`tags` 也非空。

`schema` 中有两个特殊的类型：查询（query）和变更类型（mutation）。每一个 GraphQL 服务都有一个 query 类型，可能有一个 mutation 类型。query 用于查询数据，mutation 用于创建或更新数据。这两个类型和常规对象类型一样，但是它们之所以特殊，是因为它们定义了每一个 GraphQL 查询的**入口**，相当于 RESTful 中的路由。

则比如我现在需要两个接口，分别是查询所有用户信息和根据 name 查询对应用户信息，则 schema 中需要一个 Query 类型，且其上有 users 和 user 字段：

```js
type Query {
  "查询所有用户列表"
  users: [User!]!
  "根据 name 查询对应的用户信息"
  user(name: String!): User
}
```

从 schema 中可以看出， GraphQL 是强类型的，其类型主要有对象类型、枚举类型、标量类型、接口、联合和输入类型。

标量类型是 GraphQL 查询的叶子节点，对应的字段没有任何次级字段。GraphQL 的默认标量类型有：

- Int：有符号 32 位整数。
- Float：有符号双精度浮点值。
- String：UTF‐8 字符序列。
 Boolean：true 或者 false。
- ID：ID 标量类型表示一个唯一标识符，通常用以重新获取对象或者作为缓存中的键。ID 类型使用和 String 一样的方式序列化；然而将其定义为 ID 意味着并不需要人类可读型。如 MongoDB 的 id 字段。

我们也可以通过 `scalar` 字段自定义其他标量，如 `scalar Date`。

关于 GraphQL 类型详细的说明可以参考文档：[Schema 和类型](https://graphql.cn/learn/schema/)。

### Resolver

定义好了 schema 之后，就需要实现 schema 中的 query 或 mutation。在 GraphQL 中，每个类型的每个字段都由一个 resolver 函数支持，当一个字段被执行时，相应的 resolver 被调用以产生下一个值。

简单来说，就是 schema 中的每个字段，都需要对应一个 resolver 函数，也就相当于 RESTful 中的 controller，resolver 函数是对 GraphQL 入口的实现。

以前面的 Schema，则至少需要定义 Query 中 users 和 user 两个字段的  resolver 函数：

```js
const resolvers = {
  Query: {
    users: () => [{ name: "Jack", gender: "MALE", tags: ["Alibaba"] }],
    user: (parent, args, context, info) => {
      const { name } = args;
      // find user by name...
      return { name, gender: "MALE", tags: ["Alibaba"] }
    },
  },
};
```

为了更直观看到效果，我们可以通过 [apollo-server](https://github.com/apollographql/apollo-server) 将前面写的 schema 和 resolvers 都启动起来：

```js
// index.js
const { ApolloServer, gql } = require('apollo-server');

// The GraphQL schema
const typeDefs = gql`
  enum Gender {
    MALE
    FEMALE
    NONE
  }

  type User {
    name: String!
    gender: Gender!
    tags: [String!]!
  }

  type Query {
    "查询所有用户列表"
    users: [User!]!
    "根据 name 查询对应的用户信息"
    user(name: String!): User
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    users: () => [{ name: "Jack", gender: "MALE", tags: ["Alibaba"] }],
    user: (parent, args, context, info) => {
      const { name } = args;
      // find user by name...
      return { name, gender: "MALE", tags: ["Alibaba"] }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

通过 `node index.js` 启动之后在浏览器中打开对应的 URL，就可以看到一个强大的 GraphQL 开发者工具（playground），我们可以在这里写查询语句查询 GraphQL 接口。

### GraphQL 查询


## 在 Egg.js 中使用 GraphQL

### egg-plugin-graphql 简介

### 一个简单的例子

### 模块化的 Schema

### Dataloader

### 自定义标量

### 指令

### 文件上传

### 订阅

## 前端实现 GraphQL Client

