interface CategoryBuilder {
  GetTag(Name: String): Tag;

  CreateTag(Name: String, Main: Function): Tag;

  DeleteTag(Name: String): boolean;

  UpdateTag(Name: String, NewName?: String, NewFunction?: Function): Tag;

  ExecuteTag(Name: String, Parameters?: Array<any>): Promise<any>;
}

interface RetaggedBuilder {
  GetCategory(Name: String): Category;

  CreateCategory(Name: String, Description?: String): Category;

  DeleteCategory(Name: String): boolean;

  UpdateCategory(Name: String, NewName?: String, NewDescription?: String): Category;

  Execute(Content: String): Promise<any>;
}

class Tag {
  Name: String;
  Main: Function;

  constructor(Name: String, Main: Function) {
    this.Name = Name;
    this.Main = Main;
  }
}

class Category implements CategoryBuilder {
  Name: String;
  Description: String | undefined;
  Tags: Array<Tag>;

  constructor(Name: String, Description?: String) {
    this.Name = Name;
    this.Description = Description;
    this.Tags = new Array<Tag>();
  }

  GetTag(Name: String): Tag {
    // @ts-ignore
    return this.Tags.find(Tag => Tag.Name === Name);
  }

  /**
   * Create new Tag in category.
   */
  CreateTag(Name: String, Main: Function): Tag {
    if (!this.Tags || !this.GetTag(Name)) {
      this.Tags.push(new Tag(Name, Main));
      return this.GetTag(Name);
    } else console.error(`Tag ${Name} already exists in ${this.Name}.`);
    throw false;
  }

  /**
   * Removes Tag in category.
   */
  DeleteTag(Name: String): boolean {
    if (this.GetTag(Name)) {
      this.Tags.filter(Tag => Tag.Name !== Name);
      return true;
    } else console.error(`Tag ${Name} doesn't exists in ${this.Name}.`);
    return false;
  }

  /**
   * Updates existing Tag in category.
   */
  UpdateTag(Name: String, NewName?: String, NewFunction?: Function): Tag {
    if (this.GetTag(Name)) {
      if (NewFunction) { // @ts-ignore
        this.Tags.find(Tag => Tag.Name === Name).Main = NewFunction;
      }
      if (NewName) {
        // @ts-ignore
        this.Tags.find(Tag => Tag.Name === Name).Name = NewName;
      }
      return this.GetTag(NewName ? NewName : Name);
    } else console.error(`Tag ${Name} doesn't exists in ${this.Name}.`);
    throw false;
  }

  async ExecuteTag(Name: String, Parameters?: Array<any>): Promise<any> {
    let Tag = this.GetTag(Name);
    if (Tag) {
      let Execution = Parameters ? await Tag.Main(...Parameters) : await Tag.Main();
      return Execution;
    } else {
      throw `Tag ${Name} doesn't exists in ${this.Name}.`;
    }
  }
}

class Retagged implements RetaggedBuilder {
  Categories: Array<Category>;

  constructor() {
    this.Categories = new Array<Category>();
  }

  GetCategory(Name: String): Category {
    if(!this.Categories) throw false;
    // @ts-ignore
    return this.Categories.find(Category => Category.Name === Name);
  }

  CreateCategory(Name: String, Description?: String): Category {
    if (!this.Categories || !this.GetCategory(Name)) {
      // @ts-ignore
      this.Categories.push(new Category(Name, Description));
      return this.GetCategory(Name);
    } else console.error(`Category ${Name} already exists.`);
    throw false;
  }

  DeleteCategory(Name: String): boolean {
    if (this.GetCategory(Name)) {
      // @ts-ignore
      this.Categories.filter(Category => Category.Name !== Name);
      return true;
    } else console.error(`Category ${Name} doesn't exists.`);
    return false;
  }

  UpdateCategory(Name: String, NewName?: String, NewDescription?: String): Category {
    if (this.GetCategory(Name)) {
      if (NewDescription) { // @ts-ignore
        this.GetCategory(Name).Description = NewDescription;
      }
      if (NewName) { // @ts-ignore
        this.GetCategory(Name).Name = NewName;
      }
      return this.GetCategory(NewName ? NewName : Name);
    } else console.error(`Category ${Name} doesn't exists.`);
    throw false;
  }

  async Execute(Content: String): Promise<any> {
    let match = Content.match(/(?<=(^|[^\\]){{)(.*?)(?=}})/gm);
    let Modified = [];
    if (match) {
      for (let m of match) {
        let m2 = m.match(/(?:[^|>])(\w+\.\w+)[^\\|>]*/gm);
        if (m2) {
          for (let func of m2) {
            // @ts-ignore
            let completeFunc = func.match(/(?:[^|>])(\w+\.\w+)(?=[^\\|> ]*)/gm)[0].split('.');
            let Cat = this.GetCategory(completeFunc[0]);
            if(Cat) {
              if(Cat.GetTag(completeFunc[1])) {
                let exec = Cat.ExecuteTag(completeFunc[1]);
                if(exec) {
                  Modified.push(exec);
                }
              }
            }
          }
        }
      }
      Modified = await Promise.all(Modified);
      return Modified;
    } else console.error(`No Tags found.`);
    throw false;
  }
}

export { Retagged, Category, Tag };