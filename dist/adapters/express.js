'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var nodeHTTPRequestHandler = require('../nodeHTTPRequestHandler-ace6dac5.js');
require('../resolveHTTPResponse-a7abb046.js');
require('../config-e6e74385.js');
require('../TRPCError-16b2e52d.js');
require('../codes-0a561c20.js');
require('../index-4d2d31b6.js');
require('../transformTRPCResponse-8afb9a5c.js');
require('../contentType-8356d528.js');
require('./node-http/content-type/json/index.js');
require('../contentType-8c16408e.js');

function createExpressMiddleware(opts) {
    return async (req, res)=>{
        const endpoint = req.path.slice(1);
        await nodeHTTPRequestHandler.nodeHTTPRequestHandler({
            ...opts,
            req,
            res,
            path: endpoint
        });
    };
}

exports.createExpressMiddleware = createExpressMiddleware;
