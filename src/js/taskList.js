class TaskList {
  constructor(name, tasks = {}) {
    this.name = name;
    this.tasks = tasks;
  }

  add(task) {
    this.tasks[task.name] = task;
  }

  remove(taskName) {
    this.tasks[taskName] = null;
  }
}

export default TaskList;