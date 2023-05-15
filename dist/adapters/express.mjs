import { n as nodeHTTPRequestHandler } from '../nodeHTTPRequestHandler-f0efcff4.mjs';
import '../resolveHTTPResponse-e1286cb3.mjs';
import '../config-f0387de5.mjs';
import '../TRPCError-2b10c8d2.mjs';
import '../codes-e5d244b6.mjs';
import '../index-972002da.mjs';
import '../transformTRPCResponse-0ea8c0ca.mjs';
import '../contentType-acc3be52.mjs';
import './node-http/content-type/json/index.mjs';
import '../contentType-3194ed5f.mjs';

function createExpressMiddleware(opts) {
    return async (req, res)=>{
        const endpoint = req.path.slice(1);
        await nodeHTTPRequestHandler({
            ...opts,
            req,
            res,
            path: endpoint
        });
    };
}

export { createExpressMiddleware };
