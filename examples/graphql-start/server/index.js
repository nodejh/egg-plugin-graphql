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
    users: () => [{ name: 'Jack', gender: 'MALE', tags: [ 'Alibaba' ] }, { name: 'Joe', gender: 'MALE', tags: [] }],
    user: (parent, args, context, info) => {
      const { name } = args;
      // find user by name...
      return { name, gender: 'MALE', tags: [ name ] };
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
