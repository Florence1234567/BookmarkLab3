import Model from "./model.js";

export default class CollectionFilter extends Model {
  constructor(data, params, model) {
    super();

    this.data = data;
    this.params = params;
    this.model = model;
  }

  get() {
    let result = new Set();
    let filtered = 0;

    if (this.params) {
      //Display by category.
      if (this.params.Category) {
        result = this.DisplayCategory(result, filtered);
        filtered = 1;
      }
      //Display by name.
      if (this.params.Name) {
        result = this.DisplayName(result, filtered);
        filtered = 1;
      }
      //Display by Url
      if (this.params.Url) {
        result = this.DisplayUrl(result, filtered);
        filtered = 1;
      }
      if (this.params.Limit && this.params.Offset) {
        if (filtered == 0) {
          result = this.data;
        }
        result = this.DisplayLimit(result, filtered);
      }
      //Sort by name, category or Url.
      if (this.params.Sort) {
        console.log(result);
        if (result.length == undefined) {
          result = this.data;
        }
        let param = this.params.Sort;
        result.sort((a, b) => {
          //Sort by name.
          if (this.params.Sort == "Name") {
            if (a.title < b.title) {
              return -1;
            }
            if (a.title > b.title) {
              return 1;
            }
            return 0;
          }
          //Sort by category.
          else if (this.params.Sort == "Category") {
            if (a.category < b.category) {
              return -1;
            }
            if (a.category > b.category) {
              return 1;
            }
            return 0;
          }
          //Sort by Url.
          else {
            if (a.Url < b.Url) {
              return -1;
            }
            if (a.Url > b.Url) {
              return 1;
            }
            return 0;
          }
        });

        if (param.includes("desc")) {
          result.reverse();
        }
      }

      if (this.params.Field) {
        result = this.DisplayField(result);
      }
    } else {
      return this.data;
    }
    return result;
  }

  DisplayCategory(result, filtered) {
    this.data.forEach((bookmark) => {
      if (
        this.innerCompare(
          bookmark.Category.toLowerCase(),
          this.params.Category.toLowerCase()
        ) == 0
      ) {
        result.add(bookmark);
      }
    });
    return result;
  }

  DisplayName(result, filtered) {
    let param = this.params.Name.toLowerCase().replace(/\*/g, "");
    let array;
    if (filtered == 0) {
      array = this.data;
    } else {
      array = result;
    }
    if (
      this.params.Name.toLowerCase().startsWith("*") &&
      this.params.Name.toLowerCase().endsWith("*")
    ) {
      array.forEach((bookmark) => {
        if (bookmark.Title.toLowerCase().includes(param)) {
          result.add(bookmark);
        }
      });
    } else if (this.params.Name.toLowerCase().startsWith("*")) {
      array.forEach((bookmark) => {
        if (bookmark.Title.toLowerCase().startsWith(param)) {
          result.add(bookmark);
        }
      });
    } else if (this.params.Name.toLowerCase().endsWith("*")) {
      array.forEach((bookmark) => {
        if (bookmark.Title.toLowerCase().endsWith(param)) {
          result.add(bookmark);
        }
      });
    } else {
      array.forEach((bookmark) => {
        if (
          this.innerCompare(
            bookmark.Title.toLowerCase(),
            this.params.Name.toLowerCase()
          ) == 0
        ) {
          result.add(bookmark);
        }
      });
    }
    return result;
  }

  DisplayUrl(result, filtered) {
    let array;
    if (filtered == 0) {
      array = this.data;
    } else {
      array = result;
    }
    array.forEach((bookmark) => {
      if (this.innerCompare(bookmark.Url, this.params.Url) == 0) {
        result.add(bookmark);
      }
    });
    return result;
  }

  DisplayLimit(result) {
    let start =
      (parseInt(this.params.Offset) - 1) * parseInt(this.params.Limit);
    let end = parseInt(this.params.Limit) + start;
    return result.slice(start, end);
  }

  DisplayField(result) {
    let categoriesDisplayed = new Set();
    categoriesDisplayed.add("");
    let namesDisplayed = new Set();
    namesDisplayed.add("");
    let urlsDisplayed = new Set();
    urlsDisplayed.add("");
    let fields = this.params.Field.split(",");
    result.forEach((bookmark) => {
      fields.forEach((field) => {
        if (field.toLowerCase() == "category") {
          categoriesDisplayed.forEach((category) => {
            if (category != bookmark.Category.toLowerCase()) {
              result.add(bookmark.Category.toString());
              categoriesDisplayed.add(bookmark.Category);
            }
          });
        }
        if (field.toLowerCase() == "name") {
          namesDisplayed.forEach((name) => {
            if (name != bookmark.Title.toLowerCase()) {
              result.add(bookmark.Title.toString());
              namesDisplayed.add(bookmark.Title);
            }
          });
        }
        if (field.toLowerCase() == "url") {
          urlsDisplayed.forEach((url) => {
            if (url != bookmark.Url.toLowerCase()) {
              result.add(bookmark);
              urlsDisplayed.add(bookmark.Url);
            }
          });
        }
      });
    });
    return result;
  }

  valueMatch(value, searchValue) {
    try {
      let exp = "^" + searchValue.toLowerCase().replace(/\*/g, ".*") + "$";
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
    if (typeof x === "string") return x.localeCompare(y);
    else return this.compareNum(x, y);
  }
}
