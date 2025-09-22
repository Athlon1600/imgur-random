export const sleep = (ms) => {

    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export const setIntervalOnce = (handler, timeout, name = "default") => {

    const uid = `__set_interval_once:${name}`;

    clearInterval(window[uid]);
    window[uid] = setInterval(handler, timeout);
}
