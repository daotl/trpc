import { ProcedureParams, ProcedureType } from '..';
import { AnyRootConfig, RootConfig } from '../core/internals/config';
import { Procedure } from '../core/procedure';
import { Router as NewRouter, RouterDef } from '../core/router';
import { AnyRouter as AnyOldRouter, Router as OldRouter } from '../deprecated/router';
import { TRPCErrorShape } from '../rpc';
import { CombinedDataTransformer } from '../transformer';
import { Procedure as OldProcedure } from './internals/procedure';
import { ProcedureRecord } from './router';
declare type AnyOldProcedure = OldProcedure<any, any, any, any, any, any, any, any>;
declare type convertProcedureParams<TConfig extends AnyRootConfig, TProcedure extends AnyOldProcedure> = TProcedure extends OldProcedure<infer _TInputContext, infer TContext, infer TMeta, infer TInput, infer TParsedInput, infer TOutput, infer _TParsedOutput, infer TFinalInput> ? ProcedureParams<TConfig, TContext, TInput, TParsedInput, TOutput, TFinalInput, TMeta> : never;
declare type MigrateProcedure<TConfig extends AnyRootConfig, TProcedure extends AnyOldProcedure, TType extends ProcedureType> = Procedure<TType, convertProcedureParams<TConfig, TProcedure>>;
export declare type MigrateProcedureRecord<TConfig extends AnyRootConfig, TProcedureRecord extends ProcedureRecord<any>, TType extends ProcedureType> = {
    [K in keyof TProcedureRecord]: MigrateProcedure<TConfig, TProcedureRecord[K], TType>;
};
export declare type MigrateRouter<TInputContext extends Record<string, any>, TContext, TMeta extends Record<string, any>, TQueries extends ProcedureRecord<TInputContext, TContext, any, any, any, any, any>, TMutations extends ProcedureRecord<TInputContext, TContext, any, any, any, any, any>, TSubscriptions extends ProcedureRecord<TInputContext, TContext, unknown, unknown, any, unknown, unknown>, TErrorShape extends TRPCErrorShape<any>, TTransformer extends CombinedDataTransformer> = NewRouter<RouterDef<RootConfig<{
    ctx: TInputContext;
    errorShape: TErrorShape;
    meta: TMeta;
    transformer: TTransformer;
}>, {}, {
    queries: MigrateProcedureRecord<RootConfig<{
        ctx: TInputContext;
        errorShape: TErrorShape;
        meta: TMeta;
        transformer: TTransformer;
    }>, TQueries, 'query'>;
    mutations: MigrateProcedureRecord<RootConfig<{
        ctx: TInputContext;
        errorShape: TErrorShape;
        meta: TMeta;
        transformer: TTransformer;
    }>, TMutations, 'mutation'>;
    subscriptions: MigrateProcedureRecord<RootConfig<{
        ctx: TInputContext;
        errorShape: TErrorShape;
        meta: TMeta;
        transformer: TTransformer;
    }>, TSubscriptions, 'subscription'>;
}>>;
export declare type MigrateOldRouter<TRouter extends AnyOldRouter> = TRouter extends OldRouter<infer TInputContext, infer TContext, infer TMeta, infer TQueries, infer TMutations, infer TSubscriptions, infer TErrorShape, infer Transformer> ? MigrateRouter<TInputContext, TContext, TMeta, TQueries, TMutations, TSubscriptions, TErrorShape, Transformer> : never;
export declare function migrateRouter<TOldRouter extends AnyOldRouter>(oldRouter: TOldRouter): MigrateOldRouter<TOldRouter>;
export {};
//# sourceMappingURL=interop.d.ts.map