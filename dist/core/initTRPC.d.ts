import { DefaultErrorShape, ErrorFormatter, ErrorFormatterShape } from "../error/formatter";
import { DataTransformerOptions, DefaultDataTransformer } from "../transformer";
import { FlatOverwrite, Unwrap } from "../types";
import { CreateRootConfigTypes, RootConfig, RootConfigTypes, RuntimeConfig } from "./internals/config";
import { mergeRouters } from "./internals/mergeRouters";
import { PickFirstDefined, ValidateShape } from "./internals/utils";
export declare type PartialRootConfigTypes = Partial<RootConfigTypes>;
export declare type CreateRootConfigTypesFromPartial<TTypes extends PartialRootConfigTypes> = CreateRootConfigTypes<{
    ctx: TTypes["ctx"] extends RootConfigTypes["ctx"] ? TTypes["ctx"] : object;
    meta: TTypes["meta"] extends RootConfigTypes["meta"] ? TTypes["meta"] : object;
    errorShape: TTypes["errorShape"];
    transformer: DataTransformerOptions;
}>;
/**
 * TODO: This can be improved:
 * - We should be able to chain `.meta()`/`.context()` only once
 * - Simplify typings
 * - Doesn't need to be a class but it doesn't really hurt either
 */
export declare class TRPCBuilder<TParams extends PartialRootConfigTypes = object> {
    context<TNewContext extends RootConfigTypes["ctx"] | ((...args: unknown[]) => RootConfigTypes["ctx"])>(): TRPCBuilder<FlatOverwrite<TParams, {
        ctx: Unwrap<TNewContext>;
    }>>;
    meta<TNewMeta extends RootConfigTypes["meta"]>(): TRPCBuilder<FlatOverwrite<TParams, {
        meta: TNewMeta;
    }>>;
    create<TOptions extends Partial<RuntimeConfig<CreateRootConfigTypesFromPartial<TParams>>>>(options?: ValidateShape<TOptions, Partial<RuntimeConfig<CreateRootConfigTypesFromPartial<TParams>>>> | undefined): {
        /**
         * These are just types, they can't be used
         * @internal
         */
        _config: RootConfig<{
            ctx: TParams["ctx"] extends object ? TParams["ctx"] : object;
            meta: TParams["meta"] extends object ? TParams["meta"] : object;
            errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends object ? TParams["ctx"] : object, DefaultErrorShape>>>;
            transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] : DefaultDataTransformer;
        }>;
        /**
         * Builder object for creating procedures
         */
        procedure: import("./internals/procedureBuilder").ProcedureBuilder<{
            _config: RootConfig<{
                ctx: TParams["ctx"] extends object ? TParams["ctx"] : object;
                meta: TParams["meta"] extends object ? TParams["meta"] : object;
                errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends object ? TParams["ctx"] : object, DefaultErrorShape>>>;
                transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] : DefaultDataTransformer;
            }>;
            _ctx_out: TParams["ctx"] extends object ? TParams["ctx"] : object;
            _input_in: typeof import("./internals/utils").unsetMarker;
            _input_out: typeof import("./internals/utils").unsetMarker;
            _output_in: typeof import("./internals/utils").unsetMarker;
            _output_out: typeof import("./internals/utils").unsetMarker;
            _meta: TParams["meta"] extends object ? TParams["meta"] : object;
        }>;
        /**
         * Create reusable middlewares
         */
        middleware: <TNewParams extends import("./procedure").ProcedureParams<import("./internals/config").AnyRootConfig, unknown, unknown, unknown, unknown, unknown, unknown>>(fn: import("./middleware").MiddlewareFunction<{
            _config: RootConfig<{
                ctx: TParams["ctx"] extends object ? TParams["ctx"] : object;
                meta: TParams["meta"] extends object ? TParams["meta"] : object;
                errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends object ? TParams["ctx"] : object, DefaultErrorShape>>>;
                transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] : DefaultDataTransformer;
            }>;
            _ctx_out: TParams["ctx"] extends object ? TParams["ctx"] : object;
            _input_out: unknown;
            _input_in: unknown;
            _output_in: unknown;
            _output_out: unknown;
            _meta: TParams["meta"] extends object ? TParams["meta"] : object;
        }, TNewParams>) => import("./middleware").MiddlewareBuilder<{
            _config: RootConfig<{
                ctx: TParams["ctx"] extends object ? TParams["ctx"] : object;
                meta: TParams["meta"] extends object ? TParams["meta"] : object;
                errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends object ? TParams["ctx"] : object, DefaultErrorShape>>>;
                transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] : DefaultDataTransformer;
            }>;
            _ctx_out: TParams["ctx"] extends object ? TParams["ctx"] : object;
            _input_out: unknown;
            _input_in: unknown;
            _output_in: unknown;
            _output_out: unknown;
            _meta: TParams["meta"] extends object ? TParams["meta"] : object;
        }, TNewParams>;
        /**
         * Create a router
         */
        router: <TProcRouterRecord extends import("./router").ProcedureRouterRecord>(procedures: TProcRouterRecord) => import("./router").CreateRouterInner<RootConfig<{
            ctx: TParams["ctx"] extends object ? TParams["ctx"] : object;
            meta: TParams["meta"] extends object ? TParams["meta"] : object;
            errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends object ? TParams["ctx"] : object, DefaultErrorShape>>>;
            transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] : DefaultDataTransformer;
        }>, TProcRouterRecord>;
        /**
         * Merge Routers
         */
        mergeRouters: typeof mergeRouters;
    };
}
declare const _trpc: <TParams extends Partial<RootConfigTypes> = object, TOptions extends Partial<RuntimeConfig<{
    ctx: TParams["ctx"] extends object ? TParams["ctx"] : object;
    meta: TParams["meta"] extends object ? TParams["meta"] : object;
    errorShape: TParams["errorShape"];
    transformer: DataTransformerOptions;
}>> = Partial<RuntimeConfig<{
    ctx: TParams["ctx"] extends object ? TParams["ctx"] : object;
    meta: TParams["meta"] extends object ? TParams["meta"] : object;
    errorShape: TParams["errorShape"];
    transformer: DataTransformerOptions;
}>>>(options?: ValidateShape<TOptions, Partial<RuntimeConfig<{
    ctx: TParams["ctx"] extends object ? TParams["ctx"] : object;
    meta: TParams["meta"] extends object ? TParams["meta"] : object;
    errorShape: TParams["errorShape"];
    transformer: DataTransformerOptions;
}>>> | undefined) => {
    /**
     * These are just types, they can't be used
     * @internal
     */
    _config: RootConfig<{
        ctx: TParams["ctx"] extends object ? TParams["ctx"] : object;
        meta: TParams["meta"] extends object ? TParams["meta"] : object;
        errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends object ? TParams["ctx"] : object, DefaultErrorShape>>>;
        transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] : DefaultDataTransformer;
    }>;
    /**
     * Builder object for creating procedures
     */
    procedure: import("./internals/procedureBuilder").ProcedureBuilder<{
        _config: RootConfig<{
            ctx: TParams["ctx"] extends object ? TParams["ctx"] : object;
            meta: TParams["meta"] extends object ? TParams["meta"] : object;
            errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends object ? TParams["ctx"] : object, DefaultErrorShape>>>;
            transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] : DefaultDataTransformer;
        }>;
        _ctx_out: TParams["ctx"] extends object ? TParams["ctx"] : object;
        _input_in: typeof import("./internals/utils").unsetMarker;
        _input_out: typeof import("./internals/utils").unsetMarker;
        _output_in: typeof import("./internals/utils").unsetMarker;
        _output_out: typeof import("./internals/utils").unsetMarker;
        _meta: TParams["meta"] extends object ? TParams["meta"] : object;
    }>;
    /**
     * Create reusable middlewares
     */
    middleware: <TNewParams extends import("./procedure").ProcedureParams<import("./internals/config").AnyRootConfig, unknown, unknown, unknown, unknown, unknown, unknown>>(fn: import("./middleware").MiddlewareFunction<{
        _config: RootConfig<{
            ctx: TParams["ctx"] extends object ? TParams["ctx"] : object;
            meta: TParams["meta"] extends object ? TParams["meta"] : object;
            errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends object ? TParams["ctx"] : object, DefaultErrorShape>>>;
            transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] : DefaultDataTransformer;
        }>;
        _ctx_out: TParams["ctx"] extends object ? TParams["ctx"] : object;
        _input_out: unknown;
        _input_in: unknown;
        _output_in: unknown;
        _output_out: unknown;
        _meta: TParams["meta"] extends object ? TParams["meta"] : object;
    }, TNewParams>) => import("./middleware").MiddlewareBuilder<{
        _config: RootConfig<{
            ctx: TParams["ctx"] extends object ? TParams["ctx"] : object;
            meta: TParams["meta"] extends object ? TParams["meta"] : object;
            errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends object ? TParams["ctx"] : object, DefaultErrorShape>>>;
            transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] : DefaultDataTransformer;
        }>;
        _ctx_out: TParams["ctx"] extends object ? TParams["ctx"] : object;
        _input_out: unknown;
        _input_in: unknown;
        _output_in: unknown;
        _output_out: unknown;
        _meta: TParams["meta"] extends object ? TParams["meta"] : object;
    }, TNewParams>;
    /**
     * Create a router
     */
    router: <TProcRouterRecord extends import("./router").ProcedureRouterRecord>(procedures: TProcRouterRecord) => import("./router").CreateRouterInner<RootConfig<{
        ctx: TParams["ctx"] extends object ? TParams["ctx"] : object;
        meta: TParams["meta"] extends object ? TParams["meta"] : object;
        errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends object ? TParams["ctx"] : object, DefaultErrorShape>>>;
        transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] : DefaultDataTransformer;
    }>, TProcRouterRecord>;
    /**
     * Merge Routers
     */
    mergeRouters: typeof mergeRouters;
};
export declare type TRPC<TParams extends PartialRootConfigTypes = object, TOptions extends Partial<RuntimeConfig<CreateRootConfigTypesFromPartial<TParams>>> = Partial<RuntimeConfig<CreateRootConfigTypesFromPartial<TParams>>>> = ReturnType<typeof _trpc<TParams, TOptions>>;
/**
 * Initialize tRPC - done exactly once per backend
 */
export declare const initTRPC: TRPCBuilder<object>;
export {};
//# sourceMappingURL=initTRPC.d.ts.map