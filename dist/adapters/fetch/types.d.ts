import { AnyRouter, inferRouterContext } from '../../core';
import { HTTPBaseHandlerOptions } from '../../http';
export declare type FetchCreateContextFnOptions = {
    req: Request;
    resHeaders: Headers;
};
export declare type FetchCreateContextFn<TRouter extends AnyRouter> = (opts: FetchCreateContextFnOptions) => inferRouterContext<TRouter> | Promise<inferRouterContext<TRouter>>;
export declare type FetchCreateContextOption<TRouter extends AnyRouter> = unknown extends inferRouterContext<TRouter> ? {
    /**
     * @link https://trpc.io/docs/context
     **/
    createContext?: FetchCreateContextFn<TRouter>;
} : {
    /**
     * @link https://trpc.io/docs/context
     **/
    createContext: FetchCreateContextFn<TRouter>;
};
export declare type FetchHandlerOptions<TRouter extends AnyRouter> = HTTPBaseHandlerOptions<TRouter, Request> & FetchCreateContextOption<TRouter>;
//# sourceMappingURL=types.d.ts.map