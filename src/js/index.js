import displayController from "./displayController";
import TaskList from "./taskList";
// import Task from "./task";
import Simplepicker from 'simplepicker';


displayController.initialize();

const simplepicker = (function() {

  function update() {
    const picker = createPicker();
    addOpenListener(picker);
    updateDateListener(picker);
  }

  function createPicker() {
    const taskCard = document.querySelector("#taskCard");
    const picker = new Simplepicker(taskCard, {
      zIndex: 10,
      compactMode: true
    });
    return picker;
  }
  
  function addOpenListener(picker) {
    const dueButton = document.getElementById("due");
    dueButton.addEventListener("click", (e) => {
      picker.reset(new Date);
      picker.open();
    })
  }
  
  function updateDateListener(picker) {
    picker.on("submit", function (date, readableDate) {
      displayController.renderDate(date);
    })
  }

  return {
    update
  }
  
})();

const buttonController = (function()  {

  listenForNewList();
  listenForLists();
  listenForNewTask();
  listenForTasks();
  listenForNotes();

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

  function listenForLists() {
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
    const $saveNotes = document.getElementById("saveNotes");
    $saveNotes.addEventListener("click", (e) => {
      displayController.saveNotes();
    })
  }

})();

simplepicker.update();
