import TaskList from "./taskList";
import Task from "./task";
import { format, isToday } from 'date-fns';

const displayController = (function() {
  
  var lists = [];
  var selectedList;
  var selectedTask;

  function initialize(){
    selectedList = new TaskList("Today");
    selectedTask = new Task("Water Plants")
    selectedList.add(selectedTask);
    selectedList.add(new Task("Workout"));
    lists = [selectedList, new TaskList("Work"), new TaskList("Personal")];
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
      if ($list.classList.contains("selected")) {
        $list.classList.remove("selected");
      } else if (lists[i] == selectedList) {
        $list.classList.add("selected");
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
          parent: $task
        })
        create({
          type: "span",
          parent: $task,
          text: task.name
        })
      }
      if ($task.classList.contains("selected")) {
        $task.classList.remove("selected");
      } else if (task == selectedTask) {
        $task.classList.add("selected");
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
    console.log(`Saved: ${$notes.value}`);
    selectedTask.setNotes($notes.value);
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
    renderLists();
  }

  function clearInput() {
    const $input = document.getElementById("newListInput");
    $input.parentNode.removeChild($input);
  }

  function selectList(name) {
    selectedList = lists[name.substr(-1)];
    clearList();
    renderList();
    renderLists();
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
    renderList();
  }

  function getTasks() {
    return selectedList.tasks;
  }

  function selectTask(name) {
    selectedTask = selectedList.tasks[name.substr(-1)];
    renderTask();
    renderList();
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

  }
})();

export default displayController;