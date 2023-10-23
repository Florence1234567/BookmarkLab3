import Controller from './Controller.js';

export default class CollectionFilter extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
    }

    Get() {
        const urlParams = this.HttpContext.path.params;

        if (!urlParams.op) {
            this.HttpContext.req.url = "../wwwroot/Bookmarks/index.html";
            handleStaticResourceRequest(this.HttpContext);
            return;
        }

        /*Sort(selectedCategory) {
            if (Bookmarks !== null) {
                Bookmarks.forEach(Bookmark => {
                    if (selectedCategory === Bookmark.Category)
                    this.HttpContext.response.HTML({Bookmark});
                });
            }  
        }*/
    }
}
