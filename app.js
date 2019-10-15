'use strict';

const loadGraphql = require('./lib/load_graphql');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    this.app.config.coreMiddleware.push('graphql');
  }

  async didLoad() {
    try {
      await loadGraphql(this.app);
    } catch (error) {
      this.app.coreLogger.error('Load graphql plugin error');
      throw error;
    }
  }

  // async willReady() {}

  // async didReady() {}

  // async serverDidReady() {}
}

module.exports = AppBootHook;
