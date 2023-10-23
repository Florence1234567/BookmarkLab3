import Model from './model.js';

export default class CollectionFilter extends Model {
    constructor(data, params, model) {
        this.data = data;
        this.params = params;
        this.model = model;
        console.log(data, params, model);
    }
}
