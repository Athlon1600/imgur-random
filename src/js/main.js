import {getRemainingScrollHeight} from "./util";
import {ImageFindingService} from "./services/ImageFindingService";
import {Shortcuts} from "./Shortcuts";
import {afterPaintAsync} from "./util/dom";
import {ImageGrid} from "./ui/ImageGrid";

let _app = (function () {

    let successCounter = 0;
    let errorCounter = 0;
    let filteredCount = 0;

    const img = document.querySelector('#images');
    const grid = new ImageGrid(img);

    const spanRc = document.querySelector('#span_rc');
    const spanIc = document.querySelector('#span_ic');
    const spanFc = document.querySelector('#found_percent');
    const spanFiltered = document.querySelector('#num_filtered');

    setInterval(() => {

        spanRc.innerHTML = errorCounter;
        spanIc.innerHTML = successCounter;
        spanFiltered.textContent = filteredCount;

        const percentTemp = Math.floor(successCounter / (successCounter + errorCounter) * 100);

        if (!isNaN(percentTemp)) {
            spanFc.innerHTML = percentTemp + '%';
        }

    }, 150);

    // if user already scrolled ALMOST to the bottom - load more images
    // TODO: replace with IntersectionObserver API
    const shouldLoadMore = () => {

        // TODO: make this percentage based maybe? example if over 80% of viewport already scrolled
        const maxPixelsFromTheBottom = 400;

        const BUFFER_MULTIPLIER = 3;
        const viewportHeight = (window.innerHeight * BUFFER_MULTIPLIER);

        return getRemainingScrollHeight() < viewportHeight;
    }

    const isImageValidSize = (width, height) => {
        const aspectRatio = width / height;
        return (width >= 300 && height >= 300) && (aspectRatio <= 3.0 && aspectRatio >= 0.33);
    }

    async function find(imageCount = 30) {

        /**
         *
         * @type {*[]}
         */
        const urls = await ImageFindingService.findMultiple(imageCount, {
            threadCount: imageCount,
            msBetweenRequests: 1000,
            /** @param {{url: string, width: number, height: number}} foundImage */
            onSuccess(foundImage) {

                if (isImageValidSize(foundImage.width, foundImage.height)) {
                    successCounter++;
                    grid.appendItemFromUrl(foundImage.url);
                } else {
                    filteredCount++;
                }
            },
            onError() {
                errorCounter++;
            }
        });
    }

    let isPaused = false;

    function pause() {
        isPaused = !isPaused;
        return isPaused;
    }

    Shortcuts.bind('a', () => {
        pause();
    });

    (async () => {

        while (true) {
            await afterPaintAsync(50);

            if (!isPaused && shouldLoadMore()) {
                await find();
            }
        }

    })();

    return {pause};

})();

window.app = _app;
