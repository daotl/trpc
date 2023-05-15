'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var TRPCError = require('../TRPCError-16b2e52d.js');
var nodeHTTPRequestHandler = require('../nodeHTTPRequestHandler-ace6dac5.js');
require('../resolveHTTPResponse-a7abb046.js');
require('../config-e6e74385.js');
require('../codes-0a561c20.js');
require('../index-4d2d31b6.js');
require('../transformTRPCResponse-8afb9a5c.js');
require('../contentType-8356d528.js');
require('./node-http/content-type/json/index.js');
require('../contentType-8c16408e.js');

function createNextApiHandler(opts) {
    return async (req, res)=>{
        function getPath() {
            if (typeof req.query.trpc === 'string') {
                return req.query.trpc;
            }
            if (Array.isArray(req.query.trpc)) {
                return req.query.trpc.join('/');
            }
            return null;
        }
        const path = getPath();
        if (path === null) {
            const error = opts.router.getErrorShape({
                error: new TRPCError.TRPCError({
                    message: 'Query "trpc" not found - is the file named `[trpc]`.ts or `[...trpc].ts`?',
                    code: 'INTERNAL_SERVER_ERROR'
                }),
                type: 'unknown',
                ctx: undefined,
                path: undefined,
                input: undefined
            });
            res.statusCode = 500;
            res.json({
                id: -1,
                error
            });
            return;
        }
        await nodeHTTPRequestHandler.nodeHTTPRequestHandler({
            ...opts,
            req,
            res,
            path
        });
    };
}

exports.createNextApiHandler = createNextApiHandler;
