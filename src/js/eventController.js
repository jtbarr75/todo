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
    listenForTasks();
    listenForNotes();
    listenForComplete();
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
      listenForTasks();
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
      listenForTasks();
      listenForComplete();
    }
    $newTaskInput.value = "";
  }

  function listenForTasks() {
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

  return {
    initialize
  }

})();

export default eventController;