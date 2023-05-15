/// <reference types="node" />
/// <reference types="node" />
import { IncomingMessage } from 'http';
import ws from 'ws';
import { AnyRouter } from '../core';
import { BaseHandlerOptions } from '../internals/types';
import { TRPCClientOutgoingMessage } from '../rpc';
import { CombinedDataTransformer } from '../transformer';
import { NodeHTTPCreateContextFnOptions, NodeHTTPCreateContextOption } from './node-http';
export declare function parseMessage(obj: unknown, transformer: CombinedDataTransformer): TRPCClientOutgoingMessage;
/**
 * Web socket server handler
 */
export declare type WSSHandlerOptions<TRouter extends AnyRouter> = BaseHandlerOptions<TRouter, IncomingMessage> & {
    wss: ws.Server;
    process?: NodeJS.Process;
} & NodeHTTPCreateContextOption<TRouter, IncomingMessage, ws>;
export declare type CreateWSSContextFnOptions = NodeHTTPCreateContextFnOptions<IncomingMessage, ws>;
export declare function applyWSSHandler<TRouter extends AnyRouter>(opts: WSSHandlerOptions<TRouter>): {
    broadcastReconnectNotification: () => void;
};
//# sourceMappingURL=ws.d.ts.map