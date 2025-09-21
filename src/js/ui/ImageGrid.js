import {GridItem} from "./GridItem";
import {ImageContextMenu} from "./ImageContextMenu";

const imageActions = new ImageContextMenu();

export function ImageGrid(container) {

    /** @type {HTMLDivElement} */
    let element = container;

    function appendItemFromUrl(imageUrl) {

        const temp = new GridItem(imageUrl);
        element.appendChild(temp.element);
    }

    function clear() {
        element.innerHTML = "";
    }

    const cmHandler = (evt) => {

        /** @type {HTMLImageElement} */
        const target = evt.target;

        if (target.tagName === 'IMG') {
            evt.preventDefault();

            imageActions.showAndUpdate(target)

            imageActions.show();
            imageActions.setLocation((evt.clientX + window.scrollX) + 8, (evt.clientY + window.scrollY) + 8);
        } else {

            // TODO: unless clicked on context menu itself
            if (target.closest('.dropdown')) {
                evt.preventDefault();
                return;
            }

            imageActions.hide();
        }
    }

    function initEvents() {
        element.addEventListener("contextmenu", cmHandler);

        // clicking anywhere outside, should close the menu
        document.addEventListener('click', (evt) => {
            imageActions.hide();
        });
    }

    initEvents();

    return {appendItemFromUrl};
}