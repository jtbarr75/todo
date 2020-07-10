class TaskList {
  constructor(name, tasks = []) {
    this.name = name;
    this.tasks = tasks;
  }

  add(task) {
    this.tasks.push(task);
  }

  remove(task) {
    this.tasks = this.tasks.filter((e) => e !== task);
  }

  indexOf(item) {
    return this.tasks.indexOf(item);
  }
}

export default TaskList;
