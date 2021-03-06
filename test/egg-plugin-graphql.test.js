'use strict';

const mock = require('egg-mock');

describe('test/egg-plugin-graphql.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/egg-plugin-graphql-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, graphql')
      .expect(200);
  });

  it('should GET /graphql', async () => {
    const res = await app.httpRequest().get('/graphql');
    console.log(res);
  });
});
