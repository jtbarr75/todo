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

  setNotes(n) {
    this.notes = n;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }
}

export default Task;
