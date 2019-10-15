'use strict';

const util = require('util');
const glob = require('glob');

module.exports = {
  glob: util.promisify(glob),
};
