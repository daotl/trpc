import { AnyRouter, inferRouterContext } from '../core';
import { TRPCError } from '../error/TRPCError';
import { Maybe } from '../types';
import { BaseContentTypeHandler } from './contentType';
import { HTTPResponse } from './internals/types';
import { HTTPBaseHandlerOptions, HTTPRequest } from './types';
interface ResolveHTTPRequestOptions<TRouter extends AnyRouter, TRequest extends HTTPRequest> extends HTTPBaseHandlerOptions<TRouter, TRequest> {
    createContext: () => Promise<inferRouterContext<TRouter>>;
    req: TRequest;
    path: string;
    error?: Maybe<TRPCError>;
    contentTypeHandler?: BaseContentTypeHandler<any>;
    preprocessedBody?: boolean;
}
export declare function resolveHTTPResponse<TRouter extends AnyRouter, TRequest extends HTTPRequest>(opts: ResolveHTTPRequestOptions<TRouter, TRequest>): Promise<HTTPResponse>;
export {};
//# sourceMappingURL=resolveHTTPResponse.d.ts.map