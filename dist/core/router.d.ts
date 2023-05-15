import { TRPCError } from '../error/TRPCError';
import { AnyRootConfig } from './internals/config';
import { ProcedureCallOptions } from './internals/procedureBuilder';
import { AnyMutationProcedure, AnyProcedure, AnyQueryProcedure, AnySubscriptionProcedure, ProcedureArgs } from './procedure';
import { ProcedureType, inferHandlerInput, inferProcedureOutput } from './types';
/** @internal **/
export declare type ProcedureRecord = Record<string, AnyProcedure>;
export interface ProcedureRouterRecord {
    [key: string]: AnyProcedure | AnyRouter | ProcedureRouterRecord;
}
/**
 * @deprecated
 */
interface DeprecatedProcedureRouterRecord {
    queries: Record<string, AnyQueryProcedure>;
    mutations: Record<string, AnyMutationProcedure>;
    subscriptions: Record<string, AnySubscriptionProcedure>;
}
export interface RouterDef<TConfig extends AnyRootConfig, TRecord extends ProcedureRouterRecord, 
/**
 * @deprecated
 */
TOld extends DeprecatedProcedureRouterRecord = {
    queries: {};
    mutations: {};
    subscriptions: {};
}> {
    _config: TConfig;
    router: true;
    procedures: TRecord;
    record: TRecord;
    /**
     * V9 queries
     * @deprecated
     */
    queries: TOld['queries'];
    /**
     * V9 mutations
     * @deprecated
     */
    mutations: TOld['mutations'];
    /**
     * V9 subscriptions
     * @deprecated
     */
    subscriptions: TOld['subscriptions'];
}
export declare type AnyRouterDef<TConfig extends AnyRootConfig = AnyRootConfig, TOld extends DeprecatedProcedureRouterRecord = any> = RouterDef<TConfig, any, TOld>;
/**
 * @internal
 */
declare type inferHandlerFn<TProcedures extends ProcedureRecord> = <TProcedure extends TProcedures[TPath], TPath extends keyof TProcedures & string>(path: TPath, ...args: inferHandlerInput<TProcedure>) => Promise<inferProcedureOutput<TProcedure>>;
declare type DecorateProcedure<TProcedure extends AnyProcedure> = (input: ProcedureArgs<TProcedure['_def']>[0]) => Promise<TProcedure['_def']['_output_out']>;
/**
 * @internal
 */
declare type DecoratedProcedureRecord<TProcedures extends ProcedureRouterRecord> = {
    [TKey in keyof TProcedures]: TProcedures[TKey] extends ProcedureRouterRecord ? DecoratedProcedureRecord<TProcedures[TKey]> : TProcedures[TKey] extends AnyRouter ? DecoratedProcedureRecord<TProcedures[TKey]['_def']['record']> : TProcedures[TKey] extends AnyProcedure ? DecorateProcedure<TProcedures[TKey]> : never;
};
/**
 * @internal
 */
declare type RouterCaller<TDef extends AnyRouterDef> = (ctx: TDef['_config']['$types']['ctx']) => {
    /**
     * @deprecated
     */
    query: inferHandlerFn<TDef['queries']>;
    /**
     * @deprecated
     */
    mutation: inferHandlerFn<TDef['mutations']>;
    /**
     * @deprecated
     */
    subscription: inferHandlerFn<TDef['subscriptions']>;
} & DecoratedProcedureRecord<TDef['record']>;
export interface Router<TDef extends AnyRouterDef> {
    _def: TDef;
    createCaller: RouterCaller<TDef>;
    getErrorShape(opts: {
        error: TRPCError;
        type: ProcedureType | 'unknown';
        path: string | undefined;
        input: unknown;
        ctx: undefined | TDef['_config']['$types']['ctx'];
    }): TDef['_config']['$types']['errorShape'];
}
export declare type AnyRouter = Router<AnyRouterDef>;
/**
 * @internal
 */
export declare type CreateRouterInner<TConfig extends AnyRootConfig, TProcRouterRecord extends ProcedureRouterRecord> = Router<RouterDef<TConfig, TProcRouterRecord>> & 
/**
 * This should be deleted in v11
 * @deprecated
 */ TProcRouterRecord;
/**
 * @internal
 */
export declare function createRouterFactory<TConfig extends AnyRootConfig>(config: TConfig): <TProcRouterRecord extends ProcedureRouterRecord>(procedures: TProcRouterRecord) => CreateRouterInner<TConfig, TProcRouterRecord>;
/**
 * @internal
 */
export declare function callProcedure(opts: ProcedureCallOptions & {
    procedures: ProcedureRouterRecord;
}): Promise<unknown>;
export {};
//# sourceMappingURL=router.d.ts.map