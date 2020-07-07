import TaskList from "./taskList";
import Task from "./task";

const displayController = (function() {
  
  var lists = [];

  function initialize(){
    const list1 = new TaskList("Today", {});
    const list2 = new TaskList("Work", {});
    const list3 = new TaskList("Personal", {});
    lists = [list1, list2, list3];
    renderLists();
    document.getElementById("list1").classList.add("selected");
  }

  function renderLists() {
    for (let i=0; i<lists.length; i++) {
      if (!document.getElementById(`list${i+1}`)) {
        var $list = create({
          type:   "li", 
          parent: "#lists", 
          id:     `list${i+1}`, 
          class:  "list-title", 
          text:   lists[i].name
        })
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
    if (Array.isArray(e.classes)) {
      $element.classList.add(...e.classes);
    } else if (typeof(e.classes) == "string") {
      $element.classList.add(e.classes);
    }
    document.querySelector(e.parent).appendChild($element);
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

  return {
    create,
    initialize,
    renderListInput,
    addList,
    clearInput,

  }
})();

export default displayController;