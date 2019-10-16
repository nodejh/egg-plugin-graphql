'use strict';

const loadGraphql = require('./lib/load_schema');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async didLoad() {
    try {
      await loadGraphql(this.app);
    } catch (error) {
      this.app.coreLogger.error('Load graphql plugin error');
      throw error;
    }
  }
}

module.exports = AppBootHook;
