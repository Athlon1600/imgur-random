export const appConfig = {
    getMinimumImageWidth() {
        return localStorage.getItem('search_min_width') || 300;
    }
}