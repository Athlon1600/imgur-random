export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const createElementFromString = (htmlString) => {
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();
    return template.firstChild || template.content.firstElementChild || template.firstElementChild;
}

export const getRemainingScrollHeight = () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    return scrollHeight - scrollTop - clientHeight;
}

export const isHttps = () => {
    return window.location.protocol === 'https:';
}

export const isProductionEnvironment = () => {
    return isHttps();
}

export const isDevelopmentEnvironment = () => {
    return !isProductionEnvironment();
}
