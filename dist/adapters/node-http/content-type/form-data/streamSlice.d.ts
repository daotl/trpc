/// <reference types="node" />
/// <reference types="node" />
import { Transform, TransformCallback } from 'node:stream';
declare class SliceStream extends Transform {
    #private;
    constructor(start?: number, end?: number);
    _transform(chunk: any, _: BufferEncoding, done: TransformCallback): void;
}
export declare function streamSlice(start?: number, end?: number): SliceStream;
export {};
//# sourceMappingURL=streamSlice.d.ts.map