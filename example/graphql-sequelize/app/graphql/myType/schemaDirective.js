'use strict';

const { SchemaDirectiveVisitor } = require('apollo-server');
const { defaultFieldResolver } = require('graphql');

// Create (or import) a custom schema directive
class UpperCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const result = await resolve.apply(this, args);
      console.log('result', result);
      if (typeof result === 'string') {
        return result.toUpperCase();
      }
      return result;
    };
  }
}

module.exports = {
  upper: UpperCaseDirective,
};
