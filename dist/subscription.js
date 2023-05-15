'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var TRPCError = require('./TRPCError-16b2e52d.js');
var observable = require('./observable-464116ac.js');

/**
 * @deprecated
 * This functionality is deprecated and will be removed in the next major version.
 */ function subscriptionPullFactory(opts) {
    let timer;
    let stopped = false;
    async function _pull(emit) {
        /* istanbul ignore next -- @preserve */ if (stopped) {
            return;
        }
        try {
            await opts.pull(emit);
        } catch (err /* istanbul ignore next -- @preserve */ ) {
            emit.error(TRPCError.getTRPCErrorFromUnknown(err));
        }
        /* istanbul ignore else -- @preserve */ if (!stopped) {
            timer = setTimeout(()=>_pull(emit), opts.intervalMs);
        }
    }
    return observable.observable((emit)=>{
        _pull(emit).catch((err)=>emit.error(TRPCError.getTRPCErrorFromUnknown(err)));
        return ()=>{
            clearTimeout(timer);
            stopped = true;
        };
    });
}

exports.subscriptionPullFactory = subscriptionPullFactory;
