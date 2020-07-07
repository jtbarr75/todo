class Task {
  constructor(name) {
    this.name = name;
    this.tags = [];
    this.notes = "";
  }

  setDate(d) { 
    this.date = d;
  }

  setName(n) {
    this.name = n;
  }

  addTag(tag){
    this.tags.add(tag);
  }

  removeTag(tag){
    this.tags = tags.filter( (e) => { return e !== tag } )
  }

  setNotes(n) {
    this.notes = n;
  }
}

export default Task;