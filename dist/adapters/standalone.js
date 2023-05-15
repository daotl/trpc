'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var http = require('node:http');
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

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var http__default = /*#__PURE__*/_interopDefaultLegacy(http);

function createHTTPHandler(opts) {
    return async (req, res)=>{
        // if no hostname, set a dummy one
        const href = req.url.startsWith('/') ? `http://127.0.0.1${req.url}` : req.url;
        // get procedure path and remove the leading slash
        // /procedure -> procedure
        const path = new URL(href).pathname.slice(1);
        await nodeHTTPRequestHandler.nodeHTTPRequestHandler({
            ...opts,
            req,
            res,
            path
        });
    };
}
function createHTTPServer(opts) {
    const handler = createHTTPHandler(opts);
    const server = http__default["default"].createServer((req, res)=>handler(req, res));
    return {
        server,
        listen: (port, hostname)=>{
            server.listen(port, hostname);
            const actualPort = port === 0 ? server.address().port : port;
            return {
                port: actualPort
            };
        }
    };
}

exports.createHTTPHandler = createHTTPHandler;
exports.createHTTPServer = createHTTPServer;
