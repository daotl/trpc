import { inferObservableValue } from '../observable';
import { inferTransformedProcedureOutput } from '../shared';
import { AnyProcedure, ProcedureArgs } from './procedure';
import { AnyRouter, AnyRouterDef, Router } from './router';
export declare type inferRouterDef<TRouter extends AnyRouter> = TRouter extends Router<infer TParams> ? TParams extends AnyRouterDef<any> ? TParams : never : never;
export declare type inferRouterContext<TRouter extends AnyRouter> = inferRouterDef<TRouter>['_config']['$types']['ctx'];
export declare type inferRouterError<TRouter extends AnyRouter> = inferRouterDef<TRouter>['_config']['$types']['errorShape'];
export declare type inferRouterMeta<TRouter extends AnyRouter> = inferRouterDef<TRouter>['_config']['$types']['meta'];
export declare const procedureTypes: readonly ["query", "mutation", "subscription"];
/**
 * @public
 */
export declare type ProcedureType = (typeof procedureTypes)[number];
export declare type inferHandlerInput<TProcedure extends AnyProcedure> = ProcedureArgs<inferProcedureParams<TProcedure>>;
export declare type inferProcedureInput<TProcedure extends AnyProcedure> = inferHandlerInput<TProcedure>[0];
export declare type inferProcedureParams<TProcedure> = TProcedure extends AnyProcedure ? TProcedure['_def'] : never;
export declare type inferProcedureOutput<TProcedure> = inferProcedureParams<TProcedure>['_output_out'];
/**
 * @deprecated will be removed in next major as it's v9 stuff
 */
export declare type inferSubscriptionOutput<TRouter extends AnyRouter, TPath extends keyof TRouter['_def']['subscriptions'] & string> = inferObservableValue<inferProcedureOutput<TRouter['_def']['subscriptions'][TPath]>>;
export declare type inferProcedureClientError<TProcedure extends AnyProcedure> = inferProcedureParams<TProcedure>['_config']['errorShape'];
declare type GetInferenceHelpers<TType extends 'input' | 'output', TRouter extends AnyRouter> = {
    [TKey in keyof TRouter['_def']['record']]: TRouter['_def']['record'][TKey] extends infer TRouterOrProcedure ? TRouterOrProcedure extends AnyRouter ? GetInferenceHelpers<TType, TRouterOrProcedure> : TRouterOrProcedure extends AnyProcedure ? TType extends 'input' ? inferProcedureInput<TRouterOrProcedure> : inferTransformedProcedureOutput<TRouterOrProcedure> : never : never;
};
export declare type inferRouterInputs<TRouter extends AnyRouter> = GetInferenceHelpers<'input', TRouter>;
export declare type inferRouterOutputs<TRouter extends AnyRouter> = GetInferenceHelpers<'output', TRouter>;
export {};
//# sourceMappingURL=types.d.ts.map