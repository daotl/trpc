import { T as TRPCError } from '../TRPCError-2b10c8d2.mjs';
import { n as nodeHTTPRequestHandler } from '../nodeHTTPRequestHandler-f0efcff4.mjs';
import '../resolveHTTPResponse-e1286cb3.mjs';
import '../config-f0387de5.mjs';
import '../codes-e5d244b6.mjs';
import '../index-972002da.mjs';
import '../transformTRPCResponse-0ea8c0ca.mjs';
import '../contentType-acc3be52.mjs';
import './node-http/content-type/json/index.mjs';
import '../contentType-3194ed5f.mjs';

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
                error: new TRPCError({
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
        await nodeHTTPRequestHandler({
            ...opts,
            req,
            res,
            path
        });
    };
}

export { createNextApiHandler };
