import {isDevelopmentEnvironment} from "../util";
import {getRandomImgurImageUrl} from "../util/imgur";
import {ExecutorService} from "./ExecutorService";

/**
 *
 *
 * @param url
 * @param onSuccess
 * @param onFail
 */
function loadImageOrFail(url, onSuccess, onFail) {
    const img = new Image();

    /*

    We DO NOT want to send header:
    Referer: http://localhost:8080

    because requests will fail with 403 and browser error:
    A resource is blocked by OpaqueResponseBlocking, please check browser console for details.

     */

    if (isDevelopmentEnvironment()) {
        img.referrerPolicy = "no-referrer";
    }

    // when request is made, that image is then cached since Imgur sends this header:
    // cache-control: public, max-age=31536000
    img.addEventListener('load', () => {

        // may return image that just says "image you are requesting does not exist"
        if (img.width === 161 && img.height === 81) {
            onFail();
        } else {

            const foundImage = {
                url: img.src,
                width: img.width,
                height: img.height,
            }

            if (img.width > 150 && img.height > 150) {
                onSuccess(foundImage);
            } else {
                onFail();
            }
        }

    });
    img.addEventListener('error', onFail);
    img.src = url;
}

/**
 * @typedef {object} FoundImage
 * @property {string} url - The URL of the found image.
 * @property {number} width - The width of the image in pixels.
 * @property {number} height - The height of the image in pixels.
 */


/**
 *
 * @param {string} url
 * @return {Promise<FoundImage>}
 */
async function loadImage(url) {

    return new Promise((resolve, reject) => {

        loadImageOrFail(url, (foundImage) => {
            resolve(foundImage);
        }, () => {
            reject("Not found");
        })
    });
}

async function tryLoadingRandomImgurUrl() {
    const url = getRandomImgurImageUrl(5);
    return loadImage(url);
}

export const ImageFindingService = (() => {

    async function findMultiple(limit, options = {}) {

        // reasonable defaults
        const defaultOptions = {
            threadCount: 6, // If using HTTP/1.1, 6 is max. 20 more reasonable
            msBetweenRequests: 1000,
            randomImageIdLength: 5,
            onSuccess: null,
            onError: null,
            onDone: null
        };

        const optionsWithDefaults = {...defaultOptions, ...options};

        let foundImages = [];

        /**
         *
         * @return {Promise<FoundImage>}
         */
        async function runnable() {
            return tryLoadingRandomImgurUrl();
        }

        async function process() {

            // cannot have more threads than images to find
            const threadCount = Math.min(limit, optionsWithDefaults.threadCount);

            await ExecutorService.runInParallel(runnable, threadCount, (error, result) => {

                if (error && optionsWithDefaults.onError) {
                    optionsWithDefaults.onError();
                }

                if (result && optionsWithDefaults.onSuccess) {
                    foundImages.push(result);
                    optionsWithDefaults.onSuccess(result);
                }

            });
        }

        await (async () => {

            while (foundImages.length < limit) {
                await process();
            }

        })();

        return foundImages;
    }

    return {findMultiple};
})();