/**
 * @internal
 */
export declare type identity<TType> = TType;
export declare type InferOptional<TType, TKeys extends keyof TType> = Partial<Pick<TType, TKeys>> & Omit<TType, TKeys>;
export declare type UndefinedKeys<TType> = {
    [K in keyof TType]: undefined extends TType[K] ? K : never;
}[keyof TType];
/**
 * @internal
 */
export declare type FlatOverwrite<TType, TWith> = InferOptional<{
    [TKey in keyof TWith | keyof TType]: TKey extends keyof TWith ? TWith[TKey] : TKey extends keyof TType ? TType[TKey] : never;
}, UndefinedKeys<TType> | UndefinedKeys<TWith>>;
/**
 * @internal
 */
export declare type IntersectionError<TKey extends string> = `The property '${TKey}' in your router collides with a built-in method, rename this router or procedure on your backend.`;
/**
 * @internal
 */
export declare type ProtectedIntersection<TType, TWith> = keyof TType & keyof TWith extends never ? TType & TWith : IntersectionError<keyof TType & keyof TWith & string>;
/**
 * @public
 */
export declare type Maybe<TType> = TType | undefined | null;
/**
 * @internal
 */
export declare type ThenArg<TType> = TType extends PromiseLike<infer U> ? ThenArg<U> : TType;
/**
 * @internal
 * @see https://github.com/ianstormtaylor/superstruct/blob/7973400cd04d8ad92bbdc2b6f35acbfb3c934079/src/utils.ts#L323-L325
 */
export declare type Simplify<TType> = TType extends any[] | Date ? TType : {
    [K in keyof TType]: TType[K];
};
/**
 * @public
 */
export declare type Dict<TType> = Record<string, TType | undefined>;
/**
 * @public
 */
export declare type MaybePromise<TType> = TType | Promise<TType>;
/**
 * @internal
 *
 * Creates a "lower-priority" type inference.
 * https://github.com/microsoft/TypeScript/issues/14829#issuecomment-322267089
 */
export declare type InferLast<TType> = TType & {
    [KeyType in keyof TType]: TType[KeyType];
};
/**
 * @public
 */
export declare type inferAsyncReturnType<TFunction extends (...args: any) => any> = ThenArg<ReturnType<TFunction>>;
export declare type FilterKeys<TObj extends object, TFilter> = {
    [TKey in keyof TObj]: TObj[TKey] extends TFilter ? TKey : never;
}[keyof TObj];
/**
 * @internal
 */
export declare type Filter<TObj extends object, TFilter> = Pick<TObj, FilterKeys<TObj, TFilter>>;
/**
 * Unwrap return type if the type is a function (sync or async), else use the type as is
 * @internal
 */
export declare type Unwrap<TType> = TType extends (...args: any[]) => infer R ? ThenArg<R> : TType;
/**
 * Makes the object recursively optional
 * @internal
 */
export declare type DeepPartial<TObject> = TObject extends object ? {
    [P in keyof TObject]?: DeepPartial<TObject[P]>;
} : TObject;
//# sourceMappingURL=types.d.ts.map