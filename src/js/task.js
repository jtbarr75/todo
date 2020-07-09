class Task {
  constructor(name, date = "", notes = "", completed = false) {
    this.name = name;
    this.date = Date.parse(date);
    this.notes = notes;
    this.completed = completed;
  }

  setDate(d) { 
    this.date = d;
  }

  setName(n) {
    this.name = n;
  }

  // addTag(tag){
  //   this.tags.add(tag);
  // }

  // removeTag(tag){
  //   this.tags = tags.filter( (e) => { return e !== tag } )
  // }

  setNotes(n) {
    this.notes = n;
  }

  toggleCompleted() {
    this.completed = (this.completed ? false : true);
  }
}

export default Task;