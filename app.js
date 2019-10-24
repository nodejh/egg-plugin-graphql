'use strict';

const loader = require('./lib/loader');


class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configDidLoad() {
    loader(this.app);
  }
}

module.exports = AppBootHook;
