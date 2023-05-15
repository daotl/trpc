'use strict';

var config = require('./config-e6e74385.js');
var TRPCError = require('./TRPCError-16b2e52d.js');
var transformTRPCResponse = require('./transformTRPCResponse-8afb9a5c.js');
var contentType = require('./contentType-8356d528.js');

const HTTP_METHOD_PROCEDURE_TYPE_MAP = {
    GET: 'query',
    POST: 'mutation'
};
const fallbackContentTypeHandler = {
    getInputs: contentType.getJsonContentTypeInputs
};
async function resolveHTTPResponse(opts) {
    const { router , req  } = opts;
    const contentTypeHandler = opts.contentTypeHandler ?? fallbackContentTypeHandler;
    const batchingEnabled = opts.batching?.enabled ?? true;
    if (req.method === 'HEAD') {
        // can be used for lambda warmup
        return {
            status: 204
        };
    }
    const type = HTTP_METHOD_PROCEDURE_TYPE_MAP[req.method] ?? 'unknown';
    let ctx = undefined;
    let paths = undefined;
    const isBatchCall = !!req.query.get('batch');
    function endResponse(untransformedJSON, errors) {
        let status = config.getHTTPStatusCode(untransformedJSON);
        const headers = {
            'Content-Type': 'application/json'
        };
        const meta = opts.responseMeta?.({
            ctx,
            paths,
            type,
            data: Array.isArray(untransformedJSON) ? untransformedJSON : [
                untransformedJSON
            ],
            errors
        }) ?? {};
        for (const [key, value] of Object.entries(meta.headers ?? {})){
            headers[key] = value;
        }
        if (meta.status) {
            status = meta.status;
        }
        const transformedJSON = transformTRPCResponse.transformTRPCResponse(router, untransformedJSON);
        const body = JSON.stringify(transformedJSON);
        return {
            body,
            status,
            headers
        };
    }
    try {
        if (opts.error) {
            throw opts.error;
        }
        if (isBatchCall && !batchingEnabled) {
            throw new Error(`Batching is not enabled on the server`);
        }
        /* istanbul ignore if -- @preserve */ if (type === 'subscription') {
            throw new TRPCError.TRPCError({
                message: 'Subscriptions should use wsLink',
                code: 'METHOD_NOT_SUPPORTED'
            });
        }
        if (type === 'unknown') {
            throw new TRPCError.TRPCError({
                message: `Unexpected request method ${req.method}`,
                code: 'METHOD_NOT_SUPPORTED'
            });
        }
        const inputs = await contentTypeHandler.getInputs({
            isBatchCall,
            req,
            router,
            preprocessedBody: opts.preprocessedBody ?? false
        });
        paths = isBatchCall ? opts.path.split(',') : [
            opts.path
        ];
        ctx = await opts.createContext();
        const rawResults = await Promise.all(paths.map(async (path, index)=>{
            const input = inputs[index];
            try {
                const output = await config.callProcedure({
                    procedures: router._def.procedures,
                    path,
                    rawInput: input,
                    ctx,
                    type
                });
                return {
                    input,
                    path,
                    data: output
                };
            } catch (cause) {
                const error = TRPCError.getTRPCErrorFromUnknown(cause);
                opts.onError?.({
                    error,
                    path,
                    input,
                    ctx,
                    type: type,
                    req
                });
                return {
                    input,
                    path,
                    error
                };
            }
        }));
        const errors = rawResults.flatMap((obj)=>obj.error ? [
                obj.error
            ] : []);
        const resultEnvelopes = rawResults.map((obj)=>{
            const { path , input  } = obj;
            if (obj.error) {
                return {
                    error: router.getErrorShape({
                        error: obj.error,
                        type,
                        path,
                        input,
                        ctx
                    })
                };
            } else {
                return {
                    result: {
                        data: obj.data
                    }
                };
            }
        });
        const result = isBatchCall ? resultEnvelopes : resultEnvelopes[0];
        return endResponse(result, errors);
    } catch (cause) {
        // we get here if
        // - batching is called when it's not enabled
        // - `createContext()` throws
        // - post body is too large
        // - input deserialization fails
        // - `errorFormatter` return value is malformed
        const error = TRPCError.getTRPCErrorFromUnknown(cause);
        opts.onError?.({
            error,
            path: undefined,
            input: undefined,
            ctx,
            type: type,
            req
        });
        return endResponse({
            error: router.getErrorShape({
                error,
                type,
                path: undefined,
                input: undefined,
                ctx
            })
        }, [
            error
        ]);
    }
}

exports.resolveHTTPResponse = resolveHTTPResponse;
