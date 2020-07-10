import TaskList from "./taskList";

const eventController = (function()  {

  var editing;
  var displayController;

  function initialize(display) {
    editing = false;
    displayController = display;

    listenForNewList();
    listenForSwitchLists();
    listenForNewTask();
    listenForSwitchTasks();
    listenForNotes();
    listenForComplete();
    listenForActions();
    listenForClose();
    listenForDelete();
    listenForEdit();
  }
  

  function listenForNewList() {
    const $newListButton = document.getElementById('newListButton');
    $newListButton.addEventListener("click", () => {
      createListInput();
    })
  }

  function createListInput() {
    const $listInput = displayController.renderListInput();
    $listInput.addEventListener("keyup", (e) => {
      if (e.keyCode == '13') {
        displayController.addList(new TaskList(e.target.value))
        displayController.clearInput();
        addListListener(document.getElementById("lists").lastChild);
      }
    })
    $listInput.addEventListener("blur", (e) => {
      displayController.clearInput();
    })
  }

  function listenForSwitchLists() {
    var lists = displayController.getLists();
    for (let i=0; i<lists.length; i++) {
      var $listButton = document.getElementById(`list${i}`)
      addListListener($listButton);
    }
  }

  function addListListener($target) {
    $target.addEventListener("click", (e) => {
      displayController.selectList(e.target.id);
      listenForNewTask();
      listenForSwitchTasks();
      listenForComplete();
    })
  }

  function listenForNewTask() {
    const $newTaskInput = document.getElementById("newTaskInput");
    const $newTaskButton = document.getElementById("newTaskButton");
    $newTaskInput.addEventListener("keyup", (e) => {
      if (e.keyCode == '13') {
        addTask();
      }
    })
    $newTaskButton.addEventListener("click", (e) => {
      addTask();
    })
  }

  function addTask() {
    const $newTaskInput = document.getElementById("newTaskInput");
    const value = $newTaskInput.value;
    if (value.length !== 0 && !!value.trim()) {
      displayController.addTask(value);
      listenForSwitchTasks();
      listenForComplete();
    }
    $newTaskInput.value = "";
  }

  function listenForSwitchTasks() {
    var tasks = displayController.getTasks();
    for (let i=0; i<tasks.length; i++) {
      var $taskButton = document.getElementById(`task${i}`);
      addTaskListener($taskButton);
    }
  }

  function addTaskListener($target) {
    $target.addEventListener("click", (e) => {
      displayController.selectTask(e.target.closest("li").id);
    })
  }

  function listenForNotes() {
    listenForEditNotes();
    listenForAutoSave();
  }

  function listenForEditNotes() {
    const $notes = document.getElementById("notes");
    $notes.addEventListener("click", (e) => {
      if (editing == false) {
        editing = true;
        displayController.toggleSaveButton();
      }
    })
  }

  function listenForAutoSave() {
    const $notes = document.getElementById("notes");
    $notes.addEventListener("blur", (e) => {
      editing = false;
      displayController.saveNotes();
    })
  }

  function listenForComplete() {
    var tasks = displayController.getTasks();
    for (let i=0; i<tasks.length; i++) {
      var $complete = document.getElementById(`complete${i}`);
      addCompleteListener($complete);
    }
  }

  function addCompleteListener($target) {
    $target.addEventListener("click", (e) => {
      displayController.complete(e.target);
      e.stopPropagation();
    })
  }

  function listenForActions() {
    actionOpen("list");
    actionOpen("task");
    actionClose("list");
    actionClose("task");
  }

  function actionOpen(type) {
    const $actionButton = document.getElementById(`${type}Actions`);
    $actionButton.addEventListener("click", () => {
      displayController.openMenu(type);
    })
  }

  function actionClose(type) {
    document.addEventListener("click", (e) => {
      if (e.target.parentElement.id != `${type}Menu` && e.target.id != `${type}Actions`) {
        displayController.closeMenu(type);
      }
    })
  }

  function listenForClose() {
    listenForCloseTask();
    listenForCloseList();
  }

  function listenForCloseTask() {
    const $closeTask = document.getElementById("closeTask");
    $closeTask.addEventListener("click", (e) => {
      displayController.closeTask();
    })
  }

  function listenForCloseList() {
    const $closeList = document.getElementById("closeList");
    $closeList.addEventListener("click", (e) => {
      displayController.closeList();
    })
  }

  function listenForDelete() {
    listenForDeleteTask();
    listenForDeleteList();
  }

  function listenForDeleteTask() {
    const $deleteTask = document.getElementById("deleteTask");
    $deleteTask.addEventListener("click", (e) => {
      displayController.deleteTask();
      listenForSwitchTasks();
    })
  }

  function listenForDeleteList() {
    const $deleteList = document.getElementById("deleteList");
    $deleteList.addEventListener("click", (e) => {
      displayController.deleteList();
      listenForSwitchLists();
    })
  }

  function listenForEdit() {
    listenForEditTask();
    listenForEditList();
  }

  function addEditListener($edit) {
    $edit.addEventListener("keyup", (e) => {
      if (e.keyCode == "13") {
        displayController.setTitle(e.target.parentElement, e.target.value);
        listenForSwitchLists();
        listenForSwitchTasks();
      }
    })
  }

  function listenForEditTask() {
    const $editTask = document.getElementById("editTask");
    $editTask.addEventListener("click", () => {
      const $edit = displayController.renderEdit("task");
      addEditListener($edit);
    })
  }

  function listenForEditList() {
    const $editList = document.getElementById("editList");
    $editList.addEventListener("click", () => {
      const $edit = displayController.renderEdit("list");
      addEditListener($edit);
    })
  }

  return {
    initialize
  }

})();

export default eventController;