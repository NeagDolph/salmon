'use strict';

const environment = (process.env.NODE_ENV || 'development').trim();

console.log("BEEP", environment)

if (environment === 'development') {
    module.exports = require('./build/webpack.dev.conf.js');
} else {
    module.exports = require('./build/webpack.prod.conf.js');
}