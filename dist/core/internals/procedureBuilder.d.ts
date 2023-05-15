import { MaybePromise, Simplify } from '../../types';
import { MiddlewareBuilder, MiddlewareFunction } from '../middleware';
import { Parser, inferParser } from '../parser';
import { Procedure, ProcedureParams } from '../procedure';
import { ProcedureType } from '../types';
import { AnyRootConfig } from './config';
import { DefaultValue as FallbackValue, Overwrite, OverwriteKnown, ResolveOptions, UnsetMarker } from './utils';
export declare type CreateProcedureReturnInput<TPrev extends ProcedureParams, TNext extends ProcedureParams> = ProcedureBuilder<{
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
export interface BuildProcedure<TType extends ProcedureType, TParams extends ProcedureParams, TOutput> extends Procedure<TType, UnsetMarker extends TParams['_output_out'] ? OverwriteKnown<TParams, {
    _output_in: TOutput;
    _output_out: TOutput;
}> : TParams> {
}
declare type OverwriteIfDefined<TType, TWith> = UnsetMarker extends TType ? TWith : Simplify<TType & TWith>;
declare type ErrorMessage<TMessage extends string> = TMessage;
export declare type ProcedureBuilderDef<TParams extends ProcedureParams> = {
    inputs: Parser[];
    output?: Parser;
    meta?: TParams['_meta'];
    resolver?: ProcedureBuilderResolver;
    middlewares: ProcedureBuilderMiddleware[];
    mutation?: boolean;
    query?: boolean;
    subscription?: boolean;
};
export declare type AnyProcedureBuilderDef = ProcedureBuilderDef<any>;
export interface ProcedureBuilder<TParams extends ProcedureParams> {
    /**
     * Add an input parser to the procedure.
     */
    input<$Parser extends Parser>(schema: TParams['_input_out'] extends UnsetMarker ? $Parser : inferParser<$Parser>['out'] extends Record<string, unknown> | undefined ? TParams['_input_out'] extends Record<string, unknown> | undefined ? undefined extends inferParser<$Parser>['out'] ? undefined extends TParams['_input_out'] ? $Parser : ErrorMessage<'Cannot chain an optional parser to a required parser'> : $Parser : ErrorMessage<'All input parsers did not resolve to an object'> : ErrorMessage<'All input parsers did not resolve to an object'>): ProcedureBuilder<{
        _config: TParams['_config'];
        _meta: TParams['_meta'];
        _ctx_out: TParams['_ctx_out'];
        _input_in: OverwriteIfDefined<TParams['_input_in'], inferParser<$Parser>['in']>;
        _input_out: OverwriteIfDefined<TParams['_input_out'], inferParser<$Parser>['out']>;
        _output_in: TParams['_output_in'];
        _output_out: TParams['_output_out'];
    }>;
    /**
     * Add an output parser to the procedure.
     */
    output<$Parser extends Parser>(schema: $Parser): ProcedureBuilder<{
        _config: TParams['_config'];
        _meta: TParams['_meta'];
        _ctx_out: TParams['_ctx_out'];
        _input_in: TParams['_input_in'];
        _input_out: TParams['_input_out'];
        _output_in: inferParser<$Parser>['in'];
        _output_out: inferParser<$Parser>['out'];
    }>;
    /**
     * Add a meta data to the procedure.
     */
    meta(meta: TParams['_meta']): ProcedureBuilder<TParams>;
    /**
     * Add a middleware to the procedure.
     */
    use<$Params extends ProcedureParams>(fn: MiddlewareBuilder<TParams, $Params> | MiddlewareFunction<TParams, $Params>): CreateProcedureReturnInput<TParams, $Params>;
    /**
     * Extend the procedure with another procedure.
     * @warning The TypeScript inference fails when chaining concatenated procedures.
     */
    unstable_concat<$ProcedureBuilder extends AnyProcedureBuilder>(proc: $ProcedureBuilder): $ProcedureBuilder extends ProcedureBuilder<infer $TParams> ? CreateProcedureReturnInput<TParams, $TParams> : never;
    /**
     * Query procedure
     */
    query<$Output>(resolver: (opts: ResolveOptions<TParams>) => MaybePromise<FallbackValue<TParams['_output_in'], $Output>>): BuildProcedure<'query', TParams, $Output>;
    /**
     * Mutation procedure
     */
    mutation<$Output>(resolver: (opts: ResolveOptions<TParams>) => MaybePromise<FallbackValue<TParams['_output_in'], $Output>>): BuildProcedure<'mutation', TParams, $Output>;
    /**
     * Mutation procedure
     */
    subscription<$Output>(resolver: (opts: ResolveOptions<TParams>) => MaybePromise<FallbackValue<TParams['_output_in'], $Output>>): BuildProcedure<'subscription', TParams, $Output>;
    /**
     * @internal
     */
    _def: ProcedureBuilderDef<TParams>;
}
declare type AnyProcedureBuilder = ProcedureBuilder<any>;
export declare type ProcedureBuilderMiddleware = MiddlewareFunction<any, any>;
export declare type ProcedureBuilderResolver = (opts: ResolveOptions<any>) => Promise<unknown>;
export declare function createBuilder<TConfig extends AnyRootConfig>(initDef?: Partial<AnyProcedureBuilderDef>): ProcedureBuilder<{
    _config: TConfig;
    _ctx_out: TConfig['$types']['ctx'];
    _input_in: UnsetMarker;
    _input_out: UnsetMarker;
    _output_in: UnsetMarker;
    _output_out: UnsetMarker;
    _meta: TConfig['$types']['meta'];
}>;
/**
 * @internal
 */
export interface ProcedureCallOptions {
    ctx: unknown;
    rawInput: unknown;
    input?: unknown;
    path: string;
    type: ProcedureType;
}
export {};
//# sourceMappingURL=procedureBuilder.d.ts.map