import { FastifyReply, FastifyRequest } from 'fastify';
import { AnyRouter } from '../../core';
import { HTTPBaseHandlerOptions } from '../../http';
import { NodeHTTPCreateContextOption } from '../node-http';
export declare type FastifyHandlerOptions<TRouter extends AnyRouter, TRequest extends FastifyRequest, TResponse extends FastifyReply> = HTTPBaseHandlerOptions<TRouter, TRequest> & NodeHTTPCreateContextOption<TRouter, TRequest, TResponse>;
declare type FastifyRequestHandlerOptions<TRouter extends AnyRouter, TRequest extends FastifyRequest, TResponse extends FastifyReply> = {
    req: TRequest;
    res: TResponse;
    path: string;
} & FastifyHandlerOptions<TRouter, TRequest, TResponse>;
export declare function fastifyRequestHandler<TRouter extends AnyRouter, TRequest extends FastifyRequest, TResponse extends FastifyReply>(opts: FastifyRequestHandlerOptions<TRouter, TRequest, TResponse>): Promise<void>;
export {};
//# sourceMappingURL=fastifyRequestHandler.d.ts.map