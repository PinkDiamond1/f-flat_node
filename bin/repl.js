#!/usr/bin/env node

global.require = require('@std/esm')(module);
module.exports = require('./repl.mjs').default;
