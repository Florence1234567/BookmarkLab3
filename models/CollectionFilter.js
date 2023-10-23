import Model from './model.js';

export default class CollectionFilter extends Model {
    constructor(data, params, model) {
        this.data = data;
        this.params = params;
        this.model = model;
        console.log(data, params, model);
    }

    valueMatch(value, searchValue) {
        try {
            //let exp = '^' + searchValue.toLowerCase();.replace(/\*/g, '.*') + '$';
            return new RegExp(exp).test(value.toString().toLowerCase());
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    compareNum(x, y) {
        if (x === y) return 0;
        else if (x < y) return -1;
        return 1;
    }
    innerCompare(x, y) {
        if ((typeof x) === 'string')
            return x.localeCompare(y);
        else
            return this.compareNum(x, y);
    }
}
