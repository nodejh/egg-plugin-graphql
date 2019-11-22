import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

// 定义查询语句
const GET_USER = gql`
query GetUser($userName: String!) {
  user(name: $userName) {
    name
    gender
    tags
  }
}
`;

function App() {
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

export default App;