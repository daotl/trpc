import { FilterKeys, Simplify } from '../../types';
/**
 * @link https://github.com/remix-run/remix/blob/2248669ed59fd716e267ea41df5d665d4781f4a9/packages/remix-server-runtime/serialize.ts
 */
declare type JsonPrimitive = string | number | boolean | String | Number | Boolean | null;
declare type NonJsonPrimitive = undefined | Function | symbol;
declare type IsAny<T> = 0 extends 1 & T ? true : false;
declare type JsonReturnable = JsonPrimitive | undefined;
export declare type Serialize<T> = IsAny<T> extends true ? any : T extends JsonReturnable ? T : T extends Map<any, any> | Set<any> ? object : T extends NonJsonPrimitive ? never : T extends {
    toJSON(): infer U;
} ? U : T extends [] ? [] : T extends [unknown, ...unknown[]] ? SerializeTuple<T> : T extends ReadonlyArray<infer U> ? (U extends NonJsonPrimitive ? null : Serialize<U>)[] : T extends object ? Simplify<SerializeObject<UndefinedToOptional<T>>> : never;
/** JSON serialize [tuples](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) */
declare type SerializeTuple<T extends [unknown, ...unknown[]]> = {
    [k in keyof T]: T[k] extends NonJsonPrimitive ? null : Serialize<T[k]>;
};
/**
 * JSON serialize objects (not including arrays) and classes
 * @internal
 **/
export declare type SerializeObject<T extends object> = {
    [k in keyof Omit<T, FilterKeys<T, NonJsonPrimitive>>]: Serialize<T[k]>;
};
declare type FilterDefinedKeys<TObj extends object> = Exclude<{
    [TKey in keyof TObj]: undefined extends TObj[TKey] ? never : TKey;
}[keyof TObj], undefined>;
declare type UndefinedToOptional<T extends object> = Pick<T, FilterDefinedKeys<T>> & {
    [k in keyof Omit<T, FilterDefinedKeys<T>>]?: Exclude<T[k], undefined>;
};
export {};
//# sourceMappingURL=serialize.d.ts.map