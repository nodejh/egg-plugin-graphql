import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import GetUser from './GetUser';

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
      <hr />
      <GetUser />
      <hr />
    </div>
  );
}

export default Users;