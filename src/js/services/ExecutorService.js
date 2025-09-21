function isThenable(value) {
    return typeof value?.then === 'function';
}

function toPromiseFn(runnable) {

    if (isThenable(runnable)) {
        return runnable;
    }

    return () => {

        return new Promise((resolve, reject) => {

            try {
                const result = runnable();
                resolve(result);
            } catch (e) {
                reject(e);
            }

        });
    }
}

export const ExecutorService = (function () {

    // runnableTask can be async/sync
    async function runInParallel(runnableTask, threadCount = 10, errorFirstCallback = null) {

        return new Promise((resolve, reject) => {

            const promises = [];
            const settled = [];

            for (let i = 0; i < threadCount; i++) {

                const p = toPromiseFn(runnableTask);
                promises.push(p);

                // execute immediately
                p().then((result) => {
                    settled.push(result);

                    if (errorFirstCallback) {
                        errorFirstCallback(null, result);
                    }

                }).catch((err) => {
                    settled.push(err);

                    if (errorFirstCallback) {
                        errorFirstCallback(err, null);
                    }

                });
            }

            let interval = setInterval(() => {

                if (settled.length >= promises.length) {
                    clearInterval(interval);
                    resolve(settled);
                }

            }, 100);
        });
    }

    return {runInParallel};

})();