export const ReverseImageSearch = (function () {

    function googleUrl(url) {
        return 'https://lens.google.com/uploadbyurl?url=' + encodeURIComponent(url);
    }

    function yandexUrl(url) {
        return 'https://yandex.com/images/search?rpt=imageview&url=' + encodeURIComponent(url);
    }

    function bingUrl(url) {
        return 'https://www.bing.com/images/searchbyimage?cbir=sbi&imgurl=' + encodeURIComponent(url);
    }

    function tinEyeUrl(url) {
        return 'https://tineye.com/search/?url=' + encodeURIComponent(url);
    }

    return {
        googleUrl, bingUrl, yandexUrl, tinEyeUrl
    }

})();
