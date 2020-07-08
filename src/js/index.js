import displayController from "./displayController";
import TaskList from "./taskList";
// import Task from "./task";
import Simplepicker from 'simplepicker';
import { format, isToday } from 'date-fns';

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
      var input = document.querySelector("#due");
      input.classList.add("set");
      if (isToday(date)) {
        var message = "Today";
      }
      input.value = `Due ${format(date, 'MMMM d')} at ${format(date, 'h:mm a')}`;
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
    })
  }

  function listenForNewTask() {
    const $newTaskInput = document.getElementById("newTaskInput");
    const $newTaskButton = document.getElementById("newTaskButton");
    $newTaskInput.addEventListener("keyup", (e) => {
      if (e.keyCode == '13') {
        if (e.target.value.length !== 0 && !!e.target.value.trim()) {
          displayController.addTask(e.target.value);
        }
        e.target.value = "";
      }
    })
    $newTaskButton.addEventListener("click", (e) => {
      const $newTaskInput = document.getElementById("newTaskInput");
      const value = $newTaskInput.value;
      if (value.length !== 0 && !!value.trim()) {
        displayController.addTask(value);
      }
      $newTaskInput.value = "";
    })
  }



})();

simplepicker.update();
