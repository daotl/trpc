/**
 * Copyright 2021 Remix Software Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { NodeHTTPRequest } from '../../types';
import { UploadHandler } from './uploadHandler';
/**
 * Allows you to handle multipart forms (file uploads) for your app.
 *
 * TODO: Update this comment
 * @see https://remix.run/utils/parse-multipart-form-data
 */
declare function parseMultipartFormData(request: NodeHTTPRequest, uploadHandler: UploadHandler): Promise<FormData>;
declare function isMultipartFormDataRequest(req: NodeHTTPRequest): boolean;
export declare const nodeHTTPFormDataContentTypeHandler: <TRequest extends NodeHTTPRequest, TResponse extends import("../../types").NodeHTTPResponse>() => import("../../internals/contentType").NodeHTTPContentTypeHandler<TRequest, TResponse>;
export { parseMultipartFormData as experimental_parseMultipartFormData };
export { createMemoryUploadHandler as experimental_createMemoryUploadHandler } from './memoryUploadHandler';
export { createFileUploadHandler as experimental_createFileUploadHandler } from './fileUploadHandler';
export { composeUploadHandlers as experimental_composeUploadHandlers } from './uploadHandler';
export { type UploadHandler } from './uploadHandler';
export { isMultipartFormDataRequest as experimental_isMultipartFormDataRequest };
//# sourceMappingURL=index.d.ts.map