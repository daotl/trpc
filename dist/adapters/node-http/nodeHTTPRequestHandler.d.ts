import { AnyRouter } from '../../core';
import { NodeHTTPRequest, NodeHTTPRequestHandlerOptions, NodeHTTPResponse } from './types';
export declare function nodeHTTPRequestHandler<TRouter extends AnyRouter, TRequest extends NodeHTTPRequest, TResponse extends NodeHTTPResponse>(opts: NodeHTTPRequestHandlerOptions<TRouter, TRequest, TResponse>): Promise<void>;
//# sourceMappingURL=nodeHTTPRequestHandler.d.ts.map