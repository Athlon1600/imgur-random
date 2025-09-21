/*

imgur links look like:
https://imgur.com/OkPmUII

some time ago, it used only 5 characters: abcdef
now it uses 7: OkPmUII
but sometimes 6 too: SFD1ib

*/

import {getRandomInt} from "./index";

export const getRandomImgurId = (length = 5) => {
    let base = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    while (id.length < length) {
        const pos = getRandomInt(0, base.length - 1);
        id += base.charAt(pos);
    }
    return id;
}

const generateImgurUrlFromId = (id) => {
    return `https://i.imgur.com/${id}.png`;
}

export const getRandomImgurImageUrl = (idLength = 7) => {
    const randomImageId = getRandomImgurId(idLength);
    return generateImgurUrlFromId(randomImageId);
}