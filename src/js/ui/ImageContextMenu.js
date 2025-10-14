import {createElementFromString} from "../util";
import {ReverseImageSearch} from "../services/ReverseImageSearch";
import {saveAs} from "../util/saveAs";

const html = `

<div class="dropdown">
    <a href="#"  target="_blank" class="link-imgur">Open on Imgur</a>
    <a href="#"  target="_blank" class="link-reverse-google">Reverse search (Google)</a>
    <a href="#" target="_blank" class="link-reverse-yandex">Reverse search (Yandex)</a>
    <hr>
    <a href="#" class="action-save-as" download>Save Image As...</a>
</div>

`;

export function ImageContextMenu() {

    /** @type {HTMLDivElement} */
    const element = createElementFromString(html);
    document.body.appendChild(element);

    element.querySelector('.action-save-as').addEventListener('click', (evt) => {
        evt.preventDefault();

        const imageUrl = element.querySelector('.link-imgur')?.getAttribute('href');
        saveAs(imageUrl).catch((err) => {
            alert("Error: " + err);
        })
    })

    /**
     *
     * @param {HTMLImageElement} img
     */
    function showAndUpdate(img) {
        const url = img.getAttribute('src');

        if (url) {
            element.querySelector('.link-imgur')?.setAttribute('href', url);

            const googleUrl = ReverseImageSearch.googleUrl(url);
            const yandexUrl = ReverseImageSearch.yandexUrl(url);

            element.querySelector('.link-reverse-google')?.setAttribute('href', googleUrl);
            element.querySelector('.link-reverse-yandex')?.setAttribute('href', yandexUrl);
        }
    }

    const attachTo = (btn) => {

        const rect = btn.getBoundingClientRect();
        element.style.left = (rect.left + window.scrollX) + "px";
        element.style.top = (rect.bottom + window.scrollY + 10) + "px";
    }

    function show() {
        element.style.display = "block";
    }

    function hide() {
        element.style.display = "none";
    }

    function setLocation(left, top) {
        element.style.left = left + "px";
        element.style.top = top + "px";
    }

    return {element, show, hide, attachTo, setLocation, showAndUpdate};
}