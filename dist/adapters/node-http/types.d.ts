/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { AnyRouter, inferRouterContext } from '../../core';
import { HTTPBaseHandlerOptions } from '../../http';
import { MaybePromise } from '../../types';
import { NodeHTTPContentTypeHandler } from './internals/contentType';
interface ParsedQs {
    [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}
export declare type NodeHTTPRequest = IncomingMessage & {
    query?: ParsedQs;
    body?: unknown;
};
export declare type NodeHTTPResponse = ServerResponse;
export declare type NodeHTTPCreateContextOption<TRouter extends AnyRouter, TRequest, TResponse> = object extends inferRouterContext<TRouter> ? {
    /**
     * @link https://trpc.io/docs/context
     **/
    createContext?: NodeHTTPCreateContextFn<TRouter, TRequest, TResponse>;
} : {
    /**
     * @link https://trpc.io/docs/context
     **/
    createContext: NodeHTTPCreateContextFn<TRouter, TRequest, TResponse>;
};
/**
 * @internal
 */
interface ConnectMiddleware<TRequest extends NodeHTTPRequest = NodeHTTPRequest, TResponse extends NodeHTTPResponse = NodeHTTPResponse> {
    (req: TRequest, res: TResponse, next: (err?: any) => any): void;
}
export declare type NodeHTTPHandlerOptions<TRouter extends AnyRouter, TRequest extends NodeHTTPRequest, TResponse extends NodeHTTPResponse> = HTTPBaseHandlerOptions<TRouter, TRequest> & {
    /**
     * By default, http `OPTIONS` requests are not handled, and CORS headers are not returned.
     *
     * This can be used to handle them manually or via the `cors` npm package: https://www.npmjs.com/package/cors
     *
     * ```ts
     * import cors from 'cors'
     *
     * nodeHTTPRequestHandler({
     *   cors: cors()
     * })
     * ```
     *
     * You can also use it for other needs which a connect/node.js compatible middleware can solve,
     *  though you might wish to consider an alternative solution like the Express adapter if your needs are complex.
     */
    middleware?: ConnectMiddleware;
    maxBodySize?: number;
    experimental_contentTypeHandlers?: NodeHTTPContentTypeHandler<TRequest, TResponse>[];
} & NodeHTTPCreateContextOption<TRouter, TRequest, TResponse>;
export declare type NodeHTTPRequestHandlerOptions<TRouter extends AnyRouter, TRequest extends NodeHTTPRequest, TResponse extends NodeHTTPResponse> = {
    req: TRequest;
    res: TResponse;
    path: string;
} & NodeHTTPHandlerOptions<TRouter, TRequest, TResponse>;
export declare type NodeHTTPCreateContextFnOptions<TRequest, TResponse> = {
    req: TRequest;
    res: TResponse;
};
export declare type NodeHTTPCreateContextFn<TRouter extends AnyRouter, TRequest, TResponse> = (opts: NodeHTTPCreateContextFnOptions<TRequest, TResponse>) => MaybePromise<inferRouterContext<TRouter>>;
export {};
//# sourceMappingURL=types.d.ts.map