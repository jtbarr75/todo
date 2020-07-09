import TaskList from "./taskList";
import Task from "./task";
import { format, isToday } from 'date-fns';

const displayController = (function() {
  
  var lists = [];
  var selectedList;
  var selectedTask;

  function initialize(){
    loadLists();
    renderLists();
    renderList();
    renderTask();
  }

  function renderLists() {
    for (let i=0; i<lists.length; i++) {
      var $list = document.getElementById(`list${i}`);
      if (!$list) {
        $list = create({
          type:   "li", 
          parent: "#lists", 
          id:     `list${i}`, 
          class:  "list-title", 
          text:   lists[i].name
        })
      }
      if (lists[i] == selectedList) {
        $list.classList.add("selected");
      } else if ($list.classList.contains("selected")) {
        $list.classList.remove("selected");
      }
    }
  }

  function renderList() {
    const $listTitle = document.getElementById("listTitle");
    $listTitle.textContent = selectedList.name;
    for (let i=0; i<selectedList.tasks.length; i++) {
      var task = selectedList.tasks[i];
      var $task = document.getElementById(`task${i}`);
      if (!$task) {
          $task = create({
          type: "li",
          class: "list-task",
          parent: ".list",
          id: `task${i}`
        });
        create({
          type: "button",
          class: "complete-button",
          parent: $task,
          id: `complete${i}`
        })
        create({
          type: "span",
          parent: $task,
          text: task.name
        })
      }
      if (task == selectedTask) {
        $task.classList.add("selected");
      } else if ($task.classList.contains("selected")) {
        $task.classList.remove("selected");
      }
      if (task.completed) {
        $task.classList.add("complete");
      } else {
        $task.classList.remove("complete");
      }
    }
  }

  function renderTask() {
    const $taskTitle = document.getElementById("taskTitle");
    $taskTitle.textContent = selectedTask.name;
    if (selectedTask.date) {
      renderDate(selectedTask.date);
    } else {
      clearDate();
    }
    if (selectedTask.notes) {
      renderNotes();
    } else {
      clearNotes();
    }
  }

  function renderDate(date) {
    selectedTask.setDate(date);
    var input = document.querySelector("#due");
    input.classList.add("set");
    var message = format(date, 'MMMM d');
    if (isToday(date)) {
      message = "Today";
    }
    input.value = `Due ${message} at ${format(date, 'h:mm a')}`;
    saveLists();
  }

  function clearDate() {
    var $input = document.querySelector("#due");
    $input.classList.remove("set");
    $input.value = "Add a due date...";
  }

  function renderNotes() {
    var $notes = document.getElementById("notes");
    $notes.value = selectedTask.notes;
  }

  function clearNotes() {
    var $notes = document.getElementById("notes");
    $notes.value = "";
  }

  function saveNotes() {
    var $notes = document.getElementById("notes");
    selectedTask.setNotes($notes.value);
    displayController.toggleSaveButton();
    saveLists();
  }

  function updateSaveButton(message) {
    const $save = document.getElementById("saveNotes");
    $save.textContent = message;
    if (message == "Save Notes") {
      $save.classList.add("yellow");
    } else {
      $save.classList.remove("yellow");
    }
  }

  function toggleSaveButton() {
    const $save = document.getElementById("saveNotes");
    $save.classList.toggle("active");
  }

  function create(e) {
    const $element = document.createElement(e.type);
    if (typeof(e.text) == "string") {
      $element.textContent = e.text;
    }
    if (typeof(e.src) == "string") {
      $element.src = e.src
    }
    if (typeof(e.id) == "string") {
      $element.id = e.id;
    }
    if (Array.isArray(e.class)) {
      $element.classList.add(...e.class);
    } else if (typeof(e.class) == "string") {
      $element.classList.add(e.class);
    }
    if (typeof(e.parent) == "string"){
      document.querySelector(e.parent).appendChild($element);
    } else if (e.parent instanceof Element || e.parent instanceof HTMLDocument) {
      e.parent.appendChild($element)
    }
    
    return $element;
  }

  function renderListInput() {
    const $input = create({
      type:   "input", 
      parent: "#lists", 
      id:  "newListInput" 
    })
    $input.focus();
    return $input
  }

  function addList(list) {
    lists.push(list);
    saveLists();
    renderLists();
  }

  function clearInput() {
    const $input = document.getElementById("newListInput");
    $input.parentNode.removeChild($input);
  }

  function selectList(name) {
    if (selectedList !== lists[name.substr(-1)]) {
      selectedList = lists[name.substr(-1)];
      clearList();
      renderList();
      renderLists();
      closeTask();
      openList();
    }
  }

  function clearList() {
    const $list = document.querySelector(".list");
    while ($list.firstChild) {
      $list.lastChild.remove();
    }
  }

  function getLists() {
    return lists;
  }

  function addTask(name) {
    selectedList.add(new Task(name));
    saveLists();
    renderList();
  }

  function getTasks() {
    return selectedList.tasks;
  }

  function selectTask(name) {
    if (selectedTask !== selectedList.tasks[name.substr(-1)]) {
      selectedTask = selectedList.tasks[name.substr(-1)];
      renderTask();
      renderList();
      openTask();
    }
  }

  function complete($button) {
    var task = selectedList.tasks[$button.id.substr(-1)]
    task.toggleCompleted();
    $button.classList.toggle("complete");
    saveLists();
    renderList();
  }

  function closeTask() {
    const $task = document.getElementById("taskCard");
    $task.classList.remove("open");
    selectedTask = "";
    closeMenu("task");
    renderList();
  }

  function openTask() {
    const $task = document.getElementById("taskCard");
    $task.classList.add("open");
  }

  function closeList() {
    closeTask();
    const $list = document.getElementById("listCard");
    $list.classList.remove("open");
    selectedList = "";
    renderLists();
  }

  function openList() {
    const $list = document.getElementById("listCard");
    $list.classList.add("open");
  }

  function deleteTask() {
    const $task = document.getElementById(`task${selectedList.indexOf(selectedTask)}`);
    $task.parentElement.removeChild($task);
    selectedList.remove(selectedTask);
    closeTask();
    saveLists();
  }

  function closeMenu(type) {
    const $menu = document.getElementById(`${type}Menu`);
    if ($menu.classList.contains("open")) {
      $menu.classList.remove("open");
    }
  }

  function openMenu(type) {
    const $menu = document.getElementById(`${type}Menu`);
    $menu.classList.add("open");
  }


  // Save and Load

  function saveLists() {
    localStorage.lists = JSON.stringify(lists);
  }
  
  function loadLists() {
    if (localStorage.lists) {
      var listInfo = JSON.parse(localStorage.lists);
      for (let i=0; i<listInfo.length; i++) {
        var list = listInfo[i];
        lists[i] = new TaskList(list.name);
        for (let j=0; j<list.tasks.length; j++) {
          var task = list.tasks[j];
          lists[i].add(new Task(task.name, task.date, task.notes, task.completed));
        }
      }
      selectedList = lists[0];
      selectedTask = lists[0].tasks[0];
    } else {
      selectedList = new TaskList("Today");
      selectedTask = new Task("Water Plants")
      selectedList.add(selectedTask);
      selectedList.add(new Task("Workout"));
      lists = [selectedList, new TaskList("Work"), new TaskList("Personal")];
    }
  }


  return {
    create,
    initialize,
    renderListInput,
    addList,
    clearInput,
    selectList,
    getLists,
    addTask,
    renderTask,
    getTasks,
    selectTask,
    renderDate,
    saveNotes,
    complete,
    updateSaveButton,
    toggleSaveButton,
    closeTask,
    openTask,
    closeList,
    openList,
    deleteTask,
    deleteList,
    openMenu,
    closeMenu,

  }
})();

export default displayController;