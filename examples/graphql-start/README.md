GraphQL 实践系列文章包含以下几篇文章，将在近期更新：

- [GraphQL 实践(一): GraphQL 简介](https://github.com/nodejh/nodejh.github.io/issues/51)
- 在 Egg 中使用 GraphQL
- GraphQL 如何实现文件上传
- GraphQL 订阅 
- GraphQL N + 1 问题
- GraphQL 最佳实践

- 本文代码：[https://github.com/nodejh/egg-plugin-graphql/tree/master/examples/graphql-start](https://github.com/nodejh/egg-plugin-graphql/tree/master/examples/graphql-start)


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

我们一般会在 `router`  中定义接口，也就是 RESTful API 中的路由，如 `router.get('/api/user', controller.user.index)`，然后在 `controller` 实现控制器的逻辑，一般是参数校验、权限控制、调用 `service` 以及返回结果。`service` 中则是业务的具体实现，比如操作数据库等。

而当我们使用 GraphQL 的时候，替代的则是 `router` 和 `controller`。因为 GraphQL 已经帮我们实现了路由和参数校验，并且我们可以在 GraphQL 中进行服务（`service`）的调用。

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

假设我现在需要两个接口，分别是查询所有用户信息和根据 name 查询对应用户信息，则 schema 中需要一个 Query 类型，且其上有 users 和 user 字段：

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

以前面的 Schema 为例，我们需要定义 Query 中 users 和 user 两个字段的  resolver 函数：

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

resolver 函数也支持 promise，如：

```js
const resolvers = {
  Query: {
    users: async (parent, info, context) => {
      return await context.service.user.findAll();
    }
  },
};
```

## 实例

为了更直观看到效果，我们可以通过 [apollo-server](https://github.com/apollographql/apollo-server) 将前面写的 schema 和 resolvers 都启动起来：

```sh
$ mkdir server
$ npm init -y
$ npm install apollo-server --save
```

```js
// server/index.js
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
    users: () => [{ name: "Jack", gender: "MALE", tags: ["Alibaba"] }, { name: 'Joe', gender: 'MALE', tags: [] }],
    user: (parent, args, context, info) => {
      const { name } = args;
      // find user by name...
      return { name, gender: "MALE", tags: [name] }
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

通过 `node index.js` 启动之后在浏览器中打开对应的 URL（默认是 http://localhost:4000），就可以看到一个强大的 GraphQL 开发者工具（playground），我们可以在左侧查询语句查询，执行后右侧就会显示对应的数据。

![egg-graphql-plugin.gif](https://nodejh.oss-cn-beijing.aliyuncs.com/nodejs-graphql/egg-graphql-plugin.gif)

## 查询 query


### 请求你所要的数据，不多不少

在 RESTful API 中，我们一般是通过接口查询数据，如查询所有用户列表可能是通过 HTTP GET 方法请求 `/api/users` 接口；而在 GraphQL 中，没有了路由的概念，取而代之的是**入口**，类似的，我们可以通过 GraphQL 的查询语句对 GraphQL Schema 中的入口进行查询。

查询条件：

```js
query {
  users {
    name
  }
}
```

该查询的含义是，查询 `users`，并且返回 `name` 字段。查询结果如下：

```json
{
  "data": {
    "users": [
      {
        "name": "Jack"
      },
      {
        "name": "Joe"
      }
    ]
  }
}
```

如果我们还需要得到 `gender` 和 `tags`，则可以这样写：

```js
query {
  users {
    name
    gender
    tags
  }
}
```

查询结果：

```json
{
  "data": {
    "users": [
      {
        "name": "Jack",
        "gender": "MALE",
        "tags": [
          "Alibaba"
        ]
      },
      {
        "name": "Joe",
        "gender": "MALE",
        "tags": []
      }
    ]
  }
}
```

对比 RESTful API，GraphQL 的查询语句多了对返回字段描述。我们需要什么字段，则查询什么字段，这就解决了字段冗余的问题。同时 GraphQL 查询也总能得到可预测的结果，查询结果的字段一定是与查询条件一一对应的。


### 获取多个资源，只用一个请求

当然，GraphQL 的能力不止于此。

设想另一个场景：查询所有用户名列表，并且返回用户名为 "Jack" 的详细信息。

如果使用 RESTful API，我们可能需要发起两个 HTTP 请求分别查询 `/api/users` 和 `/api/user?name=Jack` 接口。但使用 GraphQL，我们只需要定义一个查询条件即可：

```js
query GetUser {
  users {
    name
  }
  user(name: "Jack") {
    name
    gender
    tags
  }
}
```

在这个查询中，我们查询了两个入口：

- 查询 `users`，返回 `name` 字段
- 以 { "name": "Jack" } 为参数查询`user`，返回 `name`、`gender` 和 `tags` 字段

通过浏览器开发者工具查看执行查询条件后的请求，可以发现只发送了一个请求，参数分别为 `operationName` `query` 和 `variables`。

- `operationName` 是我们定义的操作名称，也就是 `GetUser`，可以省略
- `query` 是查询条件
- `variables` 是变量，上面的查询中暂时没有使用到变量，所以现在是空对象

![nodejs-graphql-query.png](https://nodejh.oss-cn-beijing.aliyuncs.com/nodejs-graphql/nodejs-graphql-query.png)

GraphQL 服务器接收到这个 HTTP 请求后，就会根据查询条件对 Schema 进行解析，也就是根据查询的字段，执行 Schema 中对应字段的 resolver 函数。

这里需要注意的是，**查询（query）字段时，是并行执行，而变更（mutation）字段时，是线性执行，一个接着一个。**

这也是 GraphQL 的强大之处，我们只需要写好 schema 以及 resolver，GraphQL 会自动根据查询语句帮我们实现服务的编排。这也解决了前后端协作中的另一个问题：前端需要聚合多个接口才能获取想要的数据。


## 变更 mutation

前面基本都在说数据的获取，但是任何完整的数据平台也都需要一个改变服务端数据的方法。

在 RESTful API 中，任何请求都可能最后导致一些服务端副作用，但是约定上建议不要使用 GET 请求来修改数据。GraphQL 也是类似，技术上而言，任何查询都可以被实现为导致数据写入，但 GraphQL 建立了一个规范，任何修改数据的操作都应该使用 mutation 来发送。

比如创建一个用户，首先 schema 应该使用 Mutation 来定义：

```js
input UserInput {
  name: String!
  gender: Gender!
}

type Mutation {
  createUser(user: UserInput!): User!
  createUserTag(tag: String!): User!
}
```

`input` 表示输入对象，看上去和普通对象一摸一样，除了关键字是 input 而不是 type。它的特别之处在于，输入对象可以用在复杂的参数中，经常是 mutation 的参数，比如上面 `createUser` 的参数。

定义了 Mutation 之后，同样需要定义对应的 resolver 函数：

```js
const resolvers = {
  Query: {
    // ...
  },
  Mutation: {
    createUser: (parent, args, context, info) => {
      const { user: { name, gender } } = args;
      // insert user to db...
      return { name, gender, tags: [] };
    },
    createUserTag: (parent, args, context, info) => {
      const { tag } = args;
      return { name: "Jack", gender: "MALE", tags: [ tag ] }
    },
  },
};
```

于是我们就可以像下面这样来请求创建用户的 GraphQL 接口了：

```js
mutation CreateUser {
  createUser(user: { "name": "Jack", "gender": "MALE" }) {
    name
    gender
  }
}
```

或者使用变量：

```js
mutation CreateUser($user: UserInput!) {
  createUser(user: $user) {
    name
    gender
  }
}
```

在开发者工具中，可以在左下角的 QUERY VARIABLES 面板中添加变量：

![nodejs-graphql-query.png](https://nodejh.oss-cn-beijing.aliyuncs.com/nodejs-graphql/nodejs-graphql-query.png)。


关于查询和变更的更多内容，可以参考 GraphQL 的文档：[查询和变更](https://graphql.cn/learn/queries/)。


## 前端开发

到此为止，我们已经使用 GraphQL 构建了一个简单的服务端及接口，并且在 playground 中进行了查询和变更。那么如何在前端中使用 GraphQL 接口呢？

前面我们已经知道 GraphQL 每一次执行，其实是向服务端发起的一个 HTTP 请求。但如果每次我们都自己手动去构建请求参数还是挺麻烦的，好在有很多开源的 GraphQL  Client 简化了我们的工作，比较推荐的依旧是 [Apollo Client](https://www.apollographql.com/docs/react/)，它支持 React/Vue/Angular 等多种框架。

### 初始化项目

以 React.js 为例，首先初始化一个项目：

```sh
$ npx create-react-app client
```

然后安装 GraphQL Client 相关依赖包：

```sh
$ cd client
$ yarn add apollo-boost @apollo/react-hooks graphql
```

> 由于 create-react-app 默认使用的 yarn，所以我们在前端使用 yarn 安装依赖包。当然也可以使用 npm：npm install apollo-boost @apollo/react-hooks graphql --save。


### 创建 Client

在安装完依赖包之后，就可以创建一个 GraphQL 的 Client，用来向 GraphQL 服务端请求数据。

参照下述代码修改 `src/index.js`， 其中 `uri` 就是我们 GraphQL 服务端的地址，`ApolloProvider` 中存储了所有 GraphQL 数据，所以建议将其作为应用的根组件。

```js
// ...
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
// ...

const client = new ApolloClient({
  uri: 'http://localhost:4000',
});

const Root = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
```


### 获取数据

通常对于一个 React 项目，我们需要用 Redux 来获取数据，需要写各种 actions、dispatch，非常繁琐。但现在使用 GraphQL，一切都变得非常简单！

[@apollo/react-hooks](https://www.apollographql.com/docs/react/api/react-hooks/) 提供了 `useQuery`、`useMutation` 等 hooks 可以让我们非常方便地获取数据。

```js
import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

// 定义查询语句
const GET_USERS = gql`
query {
  users {
    name
  }
}
`;

function Users() {
  // 使用 useQuery hook 获取数据
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      {data.users.map(user => <p>{user.name}</p>)}
    </div>
  );
}

export default Users;
```

首先我们定义了一个查询语句，就跟在 playground 中定义的一样，只不过这里需要将其放在 `gql` 中。然后使用 `useQuery` 获取数据，`useQuery` 返回 `loading` `error` `data` 等属性，我们就可以很方便地处理页面的加载状态和接口失败情况。

在前面也提到了，GraphQL 的查询是可预测的，根据查询条件，我们也可以清楚知道，`data` 属性一定会有一个 `users` 字段，且每个 `user` 有且只有 `name` 字段。

需要注意的是，如果在服务端的 GraphQL Schema 中，name 允许为空，则 `user.name` 则可能为 `null`；如果 name 不允许为空，则当服务端 `user.name` 为 null 的时候，服务端就会报错。

通过 `yarn start` 启动前端，然后在浏览器中就可以看到如下的页面：

![获取数据](https://node-blog.oss-cn-beijing.aliyuncs.com/default/graphql-start-http-client-query.jpg)


### 带参数的查询

带参数的查询也非常简单，我们只需要在查询语句中定义参数变量名称，并在 `useQuery` 的 `variables` 中把变量传递进去。

在下面的代码中，GET_USER 这个查询的变量名称是 String 类型的 `$userName`，且不能为空。通过 variables 传递变量值的时候，我们只需要使用 `userName` 即可。

```js
import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

// 定义查询语句
const GET_USER = gql`
query GET_USER($userName: String!) {
  user(name: $userName) {
    name
    gender
    tags
  }
}
`;

function User() {
  // 使用 useQuery hook 获取数据
  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      userName: 'Jack',
    }
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <p>Name: {data.user.name}</p>
      <p>Gender: {data.user.gender}</p>
      <p>Tags: {data.user.tags.join(',')}</p>
    </div>
  );
}

export default User;
```

## 总结

通过前面简单的了解就可以感受到使用 GraphQL，不管是服务端还是前端，写起来都非常简单，因为 GraphQL 以及其生态中的工具帮我们做了很多工作，节省了很多开发成本。

在开发服务端的时候，我们的 service 可以更原子化，不用关心前端到底需要什么字段，一切都可以面向后端的最佳实践，根据 GraphQL Schema 来编写 service；而前端则可以根据 Schema 来自由组合数据和服务，不必再频繁要求后端增减字段或接口。

在开发前端的时候，则更简单了，不用再繁琐地重复编写各种 action，直接用 hooks 就能实现数据的获取和更新，也很简单就能知道 loading 和异常状态，简单直接且高效。

GraphQL Playground 则为我们提供了调试和文档服务。我们可以在 playground 中方便地调试 GraphQL 接口，并且有各种语法提示，不必再使用 postman 等 HTTP 工具去请求接口。同时 playground 还自带了文档功能，其文档就是根据 GraphQL Schema 自动生成的，这样文档可以随着代码实时更新，开发者再也不用花时间去写文档，使用者也能时刻看到最新最准确的文档。

总的来说，使用 GraphQL 能极大提高开发效率。
