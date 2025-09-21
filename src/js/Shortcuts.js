// eslint-disable-next-line no-undef
const Mousetrap = require('mousetrap');

/**
 * key => array of handlers
 * @type {Map<string, Function[]>}
 */
const handlersMap = new Map();

// wrapper around Mousetrap
export class Shortcuts {

    // same as Mousetrap.bind EXCEPT it does not override previous handlers
    // TODO: make it work properly with hot reload
    static bind(keys, callback) {

        if (typeof callback !== 'function') {
            return;
        }

        const handler = handlersMap.get(keys);

        // first time registering this key?
        if (handler === undefined) {

            Mousetrap.bind(keys, () => {

                (handlersMap.get(keys) || []).forEach((callback) => {
                    callback();
                });

            });
        }

        // append as another handle for this key
        const temp = handler || [];
        temp.push(callback);
        handlersMap.set(keys, temp);
    }
}