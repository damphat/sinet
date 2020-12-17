import repl = require('repl')
import vm = require('vm')

export default function(ctx: Record<string, unknown>) : repl.REPLServer {
     const app = repl.start({
        ignoreUndefined: true,
        useGlobal: true,
        eval: (evalCmd, context, file, cb) => {
            try {
                const ret = vm.runInNewContext(evalCmd, context);

                if(ret instanceof Promise) {
                    ret
                        .then(val => cb(null, {resolve: val}))
                        .catch(err => cb(null, {reject: err}));
                    return;
                }
                cb(null, ret)
            } catch(e) {
                cb(e, undefined);
            }
        }
    })
    Object.assign(app.context, ctx)
    return app;
}
