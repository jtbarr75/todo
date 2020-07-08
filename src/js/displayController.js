import TaskList from "./taskList";
import Task from "./task";

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
  }

  function renderLists() {
    for (let i=0; i<lists.length; i++) {
      if (!document.getElementById(`list${i}`)) {
        create({
          type:   "li", 
          parent: "#lists", 
          id:     `list${i}`, 
          class:  "list-title", 
          text:   lists[i].name
        })
      }
      if (lists[i] == selectedList) {
        document.getElementById(`list${i}`).classList.add("selected");
      }
    }
  }

  function renderList() {
    const $listTitle = document.getElementById("listTitle");
    $listTitle.textContent = selectedList.name;
    for (let i=0; i<selectedList.tasks.length; i++) {
      var task = selectedList.tasks[i];
      var $taskWrapper = create({
        type: "li",
        class: "list-task",
        parent: ".list",
        id: `task${i}`
      });
      create({
        type: "button",
        class: "complete-button",
        parent: $taskWrapper
      })
      create({
        type: "span",
        parent: $taskWrapper,
        text: task.name
      })
      if (task == selectedTask) {
        document.getElementById(`task${i}`).classList.add("selected");
      }
    }
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

  return {
    create,
    initialize,
    renderListInput,
    addList,
    clearInput,
    selectList,
    getLists,

  }
})();

export default displayController;