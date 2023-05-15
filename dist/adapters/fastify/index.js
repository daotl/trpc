'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var resolveHTTPResponse = require('../../resolveHTTPResponse-a7abb046.js');
var adapters_ws = require('../ws.js');
require('../../config-e6e74385.js');
require('../../TRPCError-16b2e52d.js');
require('../../codes-0a561c20.js');
require('../../index-4d2d31b6.js');
require('../../transformTRPCResponse-8afb9a5c.js');
require('../../contentType-8356d528.js');
require('../../observable-464116ac.js');

async function fastifyRequestHandler(opts) {
    const createContext = async function _createContext() {
        return opts.createContext?.(opts);
    };
    const query = opts.req.query ? new URLSearchParams(opts.req.query) : new URLSearchParams(opts.req.url.split('?')[1]);
    const req = {
        query,
        method: opts.req.method,
        headers: opts.req.headers,
        body: opts.req.body ?? 'null'
    };
    const result = await resolveHTTPResponse.resolveHTTPResponse({
        req,
        createContext,
        path: opts.path,
        router: opts.router,
        batching: opts.batching,
        responseMeta: opts.responseMeta,
        onError (o) {
            opts?.onError?.({
                ...o,
                req: opts.req
            });
        }
    });
    const { res  } = opts;
    if ('status' in result && (!res.statusCode || res.statusCode === 200)) {
        res.statusCode = result.status;
    }
    for (const [key, value] of Object.entries(result.headers ?? {})){
        /* istanbul ignore if -- @preserve */ if (typeof value === 'undefined') {
            continue;
        }
        void res.header(key, value);
    }
    await res.send(result.body);
}

/// <reference types="@fastify/websocket" />
function fastifyTRPCPlugin(fastify, opts, done) {
    fastify.addContentTypeParser('application/json', {
        parseAs: 'string'
    }, function(_, body, _done) {
        _done(null, body);
    });
    let prefix = opts.prefix ?? '';
    // https://github.com/fastify/fastify-plugin/blob/fe079bef6557a83794bf437e14b9b9edb8a74104/plugin.js#L11
    // @ts-expect-error property 'default' does not exists on type ...
    if (typeof fastifyTRPCPlugin.default !== 'function') {
        prefix = ''; // handled by fastify internally
    }
    fastify.all(`${prefix}/:path`, async (req, res)=>{
        const path = req.params.path;
        await fastifyRequestHandler({
            ...opts.trpcOptions,
            req,
            res,
            path
        });
    });
    if (opts.useWSS) {
        adapters_ws.applyWSSHandler({
            ...opts.trpcOptions,
            wss: fastify.websocketServer
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        fastify.get(prefix ?? '/', {
            websocket: true
        }, ()=>{});
    }
    done();
}

exports.fastifyRequestHandler = fastifyRequestHandler;
exports.fastifyTRPCPlugin = fastifyTRPCPlugin;
