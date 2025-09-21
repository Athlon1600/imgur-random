import {createElementFromString} from "../util";

function generateElement(imageUrl) {

    const html = `

<figure class="grid-item">
    <img src="${imageUrl}" alt="" referrerpolicy="no-referrer" loading="lazy">
</figure>

`;

    return createElementFromString(html);
}

export function GridItem(imageUrl) {

    let element = generateElement(imageUrl);
    // hide();

    document.body.appendChild(element);

    let originalDisplayClass = '';

    function show() {
        element.style.display = (originalDisplayClass || "block");
    }

    function hide() {

        const props = getComputedStyle(element);
        originalDisplayClass = props.display;

        element.style.display = "none";
    }

    return {show, hide, element};
}