import http from 'node:http';
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

function createHTTPHandler(opts) {
    return async (req, res)=>{
        // if no hostname, set a dummy one
        const href = req.url.startsWith('/') ? `http://127.0.0.1${req.url}` : req.url;
        // get procedure path and remove the leading slash
        // /procedure -> procedure
        const path = new URL(href).pathname.slice(1);
        await nodeHTTPRequestHandler({
            ...opts,
            req,
            res,
            path
        });
    };
}
function createHTTPServer(opts) {
    const handler = createHTTPHandler(opts);
    const server = http.createServer((req, res)=>handler(req, res));
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

export { createHTTPHandler, createHTTPServer };
