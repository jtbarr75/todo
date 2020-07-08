class TaskList {
  constructor(name, tasks = []) {
    this.name = name;
    this.tasks = tasks;
  }

  add(task) {
    this.tasks.push(task);
  }

  remove(taskName) {
    this.tasks = tasks.filter( (e) => { return e.name !== taskName } )
  }

  indexOf(item) {
    return this.tasks.indexOf(item);
  }
}

export default TaskList;