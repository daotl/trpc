/**
 * @see https://github.com/remix-run/remix/blob/0bcb4a304dd2f08f6032c3bf0c3aa7eb5b976901/packages/remix-server-runtime/formData.ts
 */
export declare type UploadHandlerPart = {
    name: string;
    filename?: string;
    contentType: string;
    data: AsyncIterable<Uint8Array>;
};
export declare type UploadHandler = (part: UploadHandlerPart) => Promise<File | string | null | undefined>;
export declare function composeUploadHandlers(...handlers: UploadHandler[]): UploadHandler;
export declare class MaxPartSizeExceededError extends Error {
    field: string;
    maxBytes: number;
    constructor(field: string, maxBytes: number);
}
export declare type MemoryUploadHandlerFilterArgs = {
    filename?: string;
    contentType: string;
    name: string;
};
export declare type MemoryUploadHandlerOptions = {
    /**
     * The maximum upload size allowed. If the size is exceeded an error will be thrown.
     * Defaults to 3000000B (3MB).
     */
    maxPartSize?: number;
    /**
     *
     * @param filename
     * @param mimetype
     * @param encoding
     */
    filter?(args: MemoryUploadHandlerFilterArgs): boolean | Promise<boolean>;
};
/**
 * @see
 */
export declare function createMemoryUploadHandler({ filter, maxPartSize, }?: MemoryUploadHandlerOptions): UploadHandler;
//# sourceMappingURL=uploadHandler.d.ts.map