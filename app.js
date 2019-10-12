'use strict';

module.exports = app => {
  require('./lib/load_graphql_server')(app);
  // require('./lib/load_connector')(app);
};

