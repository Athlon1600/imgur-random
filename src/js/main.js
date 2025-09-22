import {getRemainingScrollHeight} from "./util";
import {ImageFindingService} from "./services/ImageFindingService";
import {Shortcuts} from "./Shortcuts";
import {afterPaintAsync} from "./util/dom";
import {ImageGrid} from "./ui/ImageGrid";
import {BufferSizeManager} from "./services/BufferSizeManager";
import {appConfig} from "./appConfig";

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

        spanRc.innerHTML = (successCounter + errorCounter + filteredCount);
        spanIc.innerHTML = successCounter;
        spanFiltered.textContent = filteredCount;

        const percentTemp = Math.floor(successCounter / (successCounter + errorCounter) * 100);

        if (!isNaN(percentTemp)) {
            spanFc.innerHTML = percentTemp + '%';
        }

    }, 150);

    const isImageValidSize = (width, height) => {
        const aspectRatio = width / height;
        return (width >= appConfig.getMinimumImageWidth() && height >= 300) && (aspectRatio <= 3.0 && aspectRatio >= 0.33);
    }

    async function find(imageCount) {

        const urls = await ImageFindingService.findMultiple(imageCount, {
            threadCount: imageCount,
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

    // should have AT LEAST 3 screens worth of images - up to 5 screens
    const buffer = new BufferSizeManager(
        window.innerHeight * 3,
        window.innerHeight * 5
    );

    setInterval(() => {
        buffer.update(getRemainingScrollHeight());
    }, 1000);

    (async () => {

        while (true) {
            await afterPaintAsync(50);

            const imageCount = 30;

            if (getRemainingScrollHeight() < buffer.getTargetSize()) {

                if (!isPaused) {
                    await find(imageCount);
                }
            }
        }

    })();

    return {pause, getRemainingScrollHeight};

})();

window.app = _app;
