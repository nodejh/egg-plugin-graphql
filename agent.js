'use strict';

module.exports = agent => {
  require('./lib/load_graphql_server')(agent);
  // require('./lib/load_connector')(agent);
};

