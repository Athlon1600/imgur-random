export const nextTick = (fn) => {

    const basePromise = Promise.resolve();

    if (typeof fn === "function") {
        return basePromise.then(() => fn());
    }

    return basePromise;
}

export const afterPaint = (callback, delayMs = 0) => {

    requestAnimationFrame(() => {

        requestAnimationFrame(() => {
            const delayMsInteger = parseInt(delayMs) || 0;

            setTimeout(() => {
                callback();
            }, delayMsInteger);
        });
    });
}

export const afterPaintAsync = (delayMs = 0) => {

    return new Promise((resolve) => {

        afterPaint(() => {
            resolve();
        }, delayMs);
    });
}