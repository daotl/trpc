import { TRPCError } from '../error/TRPCError';
import { Simplify } from '../types';
import { AnyRootConfig } from './internals/config';
import { ParseFn } from './internals/getParseFn';
import { ProcedureBuilderMiddleware } from './internals/procedureBuilder';
import { DefaultValue as FallbackValue, MiddlewareMarker, Overwrite } from './internals/utils';
import { ProcedureParams } from './procedure';
import { ProcedureType } from './types';
/**
 * @internal
 */
interface MiddlewareResultBase {
    /**
     * All middlewares should pass through their `next()`'s output.
     * Requiring this marker makes sure that can't be forgotten at compile-time.
     */
    readonly marker: MiddlewareMarker;
}
/**
 * @internal
 */
interface MiddlewareOKResult<_TParams extends ProcedureParams> extends MiddlewareResultBase {
    ok: true;
    data: unknown;
}
/**
 * @internal
 */
interface MiddlewareErrorResult<_TParams extends ProcedureParams> extends MiddlewareResultBase {
    ok: false;
    error: TRPCError;
}
/**
 * @internal
 */
export declare type MiddlewareResult<TParams extends ProcedureParams> = MiddlewareOKResult<TParams> | MiddlewareErrorResult<TParams>;
/**
 * @internal
 */
export interface MiddlewareBuilder<TRoot extends ProcedureParams, TNewParams extends ProcedureParams> {
    /**
     * Create a new builder based on the current middleware builder
     */
    unstable_pipe<$Params extends ProcedureParams>(fn: {
        _config: TRoot['_config'];
        _meta: TRoot['_meta'];
        _ctx_out: Overwrite<TRoot['_ctx_out'], TNewParams['_ctx_out']>;
        _input_in: FallbackValue<TRoot['_input_in'], TNewParams['_input_in']>;
        _input_out: FallbackValue<TRoot['_input_out'], TNewParams['_input_out']>;
        _output_in: FallbackValue<TRoot['_output_in'], TNewParams['_output_in']>;
        _output_out: FallbackValue<TRoot['_output_out'], TNewParams['_output_out']>;
    } extends infer OParams extends ProcedureParams ? MiddlewareBuilder<OParams, $Params> | MiddlewareFunction<OParams, $Params> : never): CreateMiddlewareReturnInput<TRoot, TNewParams, Overwrite<TNewParams, $Params>>;
    /**
     * List of middlewares within this middleware builder
     */
    _middlewares: MiddlewareFunction<TRoot, TNewParams>[];
}
/**
 * @internal
 * FIXME: there must be a nicer way of doing this, it's hard to maintain when we have several structures like this
 */
declare type CreateMiddlewareReturnInput<TRoot extends ProcedureParams, TPrev extends ProcedureParams, TNext extends ProcedureParams> = MiddlewareBuilder<TRoot, {
    _config: TPrev['_config'];
    _meta: TPrev['_meta'];
    _ctx_out: Overwrite<TPrev['_ctx_out'], TNext['_ctx_out']>;
    _input_in: FallbackValue<TNext['_input_in'], TPrev['_input_in']>;
    _input_out: FallbackValue<TNext['_input_out'], TPrev['_input_out']>;
    _output_in: FallbackValue<TNext['_output_in'], TPrev['_output_in']>;
    _output_out: FallbackValue<TNext['_output_out'], TPrev['_output_out']>;
}>;
/**
 * @internal
 */
declare type deriveParamsFromConfig<TConfig extends AnyRootConfig> = {
    _config: TConfig;
    _ctx_out: TConfig['$types']['ctx'];
    _input_out: unknown;
    _input_in: unknown;
    _output_in: unknown;
    _output_out: unknown;
    _meta: TConfig['$types']['meta'];
};
/**
 * @internal
 */
export declare type MiddlewareFunction<TParams extends ProcedureParams, TParamsAfter extends ProcedureParams> = {
    (opts: {
        ctx: Simplify<TParams['_ctx_out']>;
        type: ProcedureType;
        path: string;
        input: TParams['_input_out'];
        rawInput: unknown;
        meta: TParams['_meta'] | undefined;
        next: {
            (): Promise<MiddlewareResult<TParams>>;
            <$Context>(opts: {
                ctx: $Context;
            }): Promise<MiddlewareResult<{
                _config: TParams['_config'];
                _ctx_out: $Context;
                _input_in: TParams['_input_in'];
                _input_out: TParams['_input_out'];
                _output_in: TParams['_output_in'];
                _output_out: TParams['_output_out'];
                _meta: TParams['_meta'];
            }>>;
            (opts: {
                rawInput: unknown;
            }): Promise<MiddlewareResult<TParams>>;
        };
    }): Promise<MiddlewareResult<TParamsAfter>>;
    _type?: string | undefined;
};
/**
 * @internal
 */
export declare function createMiddlewareFactory<TConfig extends AnyRootConfig>(): <TNewParams extends ProcedureParams<AnyRootConfig, unknown, unknown, unknown, unknown, unknown, unknown>>(fn: MiddlewareFunction<deriveParamsFromConfig<TConfig>, TNewParams>) => MiddlewareBuilder<deriveParamsFromConfig<TConfig>, TNewParams>;
/**
 * @internal
 * Please note, `trpc-openapi` uses this function.
 */
export declare function createInputMiddleware<TInput>(parse: ParseFn<TInput>): ProcedureBuilderMiddleware;
/**
 * @internal
 */
export declare function createOutputMiddleware<TOutput>(parse: ParseFn<TOutput>): ProcedureBuilderMiddleware;
export {};
//# sourceMappingURL=middleware.d.ts.map