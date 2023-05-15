'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var resolveHTTPResponse = require('../../resolveHTTPResponse-a7abb046.js');
require('../../config-e6e74385.js');
require('../../TRPCError-16b2e52d.js');
require('../../codes-0a561c20.js');
require('../../index-4d2d31b6.js');
require('../../transformTRPCResponse-8afb9a5c.js');
require('../../contentType-8356d528.js');

async function fetchRequestHandler(opts) {
    const resHeaders = new Headers();
    const createContext = async ()=>{
        return opts.createContext?.({
            req: opts.req,
            resHeaders
        });
    };
    const url = new URL(opts.req.url);
    const path = url.pathname.slice(opts.endpoint.length + 1);
    const req = {
        query: url.searchParams,
        method: opts.req.method,
        headers: Object.fromEntries(opts.req.headers),
        body: opts.req.headers.get('content-type') === 'application/json' ? await opts.req.text() : ''
    };
    const result = await resolveHTTPResponse.resolveHTTPResponse({
        req,
        createContext,
        path,
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
    for (const [key, value] of Object.entries(result.headers ?? {})){
        /* istanbul ignore if -- @preserve */ if (typeof value === 'undefined') {
            continue;
        }
        if (typeof value === 'string') {
            resHeaders.set(key, value);
            continue;
        }
        for (const v of value){
            resHeaders.append(key, v);
        }
    }
    const res = new Response(result.body, {
        status: result.status,
        headers: resHeaders
    });
    return res;
}

exports.fetchRequestHandler = fetchRequestHandler;
