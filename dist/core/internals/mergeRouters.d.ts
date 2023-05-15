import { AnyRouter, AnyRouterDef, Router, RouterDef } from '../router';
/**
 * @internal
 */
export declare type MergeRouters<TRouters extends AnyRouter[], TRouterDef extends AnyRouterDef = RouterDef<TRouters[0]['_def']['_config'], {}>> = TRouters extends [
    infer Head extends AnyRouter,
    ...infer Tail extends AnyRouter[]
] ? MergeRouters<Tail, {
    _config: TRouterDef['_config'];
    router: true;
    procedures: TRouterDef['procedures'] & Head['_def']['procedures'];
    record: TRouterDef['record'] & Head['_def']['record'];
    queries: TRouterDef['queries'] & Head['_def']['queries'];
    mutations: TRouterDef['mutations'] & Head['_def']['mutations'];
    subscriptions: TRouterDef['subscriptions'] & Head['_def']['subscriptions'];
}> : Router<TRouterDef> & TRouterDef['record'];
export declare function mergeRouters<TRouters extends AnyRouter[]>(...routerList: [...TRouters]): MergeRouters<TRouters>;
//# sourceMappingURL=mergeRouters.d.ts.map