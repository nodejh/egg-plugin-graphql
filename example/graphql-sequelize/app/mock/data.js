'use strict';

module.exports = {
  user: [
    {
      id: 1,
      name: 'Jack',
      age: 10,
    },
    {
      id: 2,
      name: 'Joe',
      age: 9,
    },
  ],
  post: [
    {
      id: 100,
      title: 'title 1',
      content: 'content 1',
      userId: 1,
      createAt: new Date('2019-10-12 12:30:01'),
    },
    {
      id: 101,
      title: 'title 2',
      content: 'content 2',
      userId: 1,
      createAt: new Date('2019-10-01 12:30:01'),
    },
  ],
};
