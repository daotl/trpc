import { Simplify } from '../../types';
import { ProcedureParams } from '../procedure';
/**
 * @internal
 */
export declare type Overwrite<TType, TWith> = TType extends any ? TWith extends any ? {
    [K in keyof TType | keyof TWith]: K extends keyof TWith ? TWith[K] : K extends keyof TType ? TType[K] : never;
} : never : never;
/**
 * @internal
 */
export declare type OverwriteKnown<TType, TWith> = {
    [K in keyof TType]: K extends keyof TWith ? TWith[K] : TType[K];
};
/**
 * @internal
 */
export declare type DefaultValue<TValue, TFallback> = UnsetMarker extends TValue ? TFallback : TValue;
/**
 * @internal
 */
export declare const middlewareMarker: "middlewareMarker" & {
    __brand: 'middlewareMarker';
};
/**
 * @internal
 */
export declare type MiddlewareMarker = typeof middlewareMarker;
/**
 * @internal
 */
export declare const unsetMarker: unique symbol;
/**
 * @internal
 */
export declare type UnsetMarker = typeof unsetMarker;
/**
 * @internal
 */
export interface ResolveOptions<TParams extends ProcedureParams> {
    ctx: Simplify<TParams['_ctx_out']>;
    input: TParams['_input_out'] extends UnsetMarker ? undefined : TParams['_input_out'];
}
/**
 * @internal
 */
export declare type ValidateShape<TActualShape, TExpectedShape> = TActualShape extends TExpectedShape ? Exclude<keyof TActualShape, keyof TExpectedShape> extends never ? TActualShape : TExpectedShape : never;
/**
 * @internal
 */
export declare type PickFirstDefined<TType, TPick> = undefined extends TType ? undefined extends TPick ? never : TPick : TType;
//# sourceMappingURL=utils.d.ts.map