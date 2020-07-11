import { format, isToday } from "date-fns";
import TaskList from "./taskList";
import Task from "./task";

const displayController = (function createEventController() {
  let lists = [];
  let selectedList;
  let selectedTask;

  function create(e) {
    const $element = document.createElement(e.type);
    if (typeof e.text === "string") {
      $element.textContent = e.text;
    }
    if (typeof e.src === "string") {
      $element.src = e.src;
    }
    if (typeof e.id === "string") {
      $element.id = e.id;
    }
    if (Array.isArray(e.class)) {
      $element.classList.add(...e.class);
    } else if (typeof e.class === "string") {
      $element.classList.add(e.class);
    }
    if (typeof e.parent === "string") {
      document.querySelector(e.parent).appendChild($element);
    } else if (
      e.parent instanceof Element ||
      e.parent instanceof HTMLDocument
    ) {
      e.parent.appendChild($element);
    }

    return $element;
  }

  function renderLists() {
    for (let i = 0; i < lists.length; i += 1) {
      let $list = document.getElementById(`list${i}`);
      if (!$list) {
        $list = create({
          type: "li",
          parent: "#lists",
          id: `list${i}`,
          class: "list-title",
          text: lists[i].name,
        });
      }
      if (lists[i] === selectedList) {
        $list.classList.add("selected");
      } else if ($list.classList.contains("selected")) {
        $list.classList.remove("selected");
      }
    }
  }

  function deleteChildren($node) {
    while ($node.firstChild) {
      $node.removeChild($node.lastChild);
    }
  }

  // Save and Load

  function saveLists() {
    localStorage.lists = JSON.stringify(lists);
  }

  function loadLists() {
    if (localStorage.lists) {
      const listInfo = JSON.parse(localStorage.lists);
      for (let i = 0; i < listInfo.length; i += 1) {
        const list = listInfo[i];
        lists[i] = new TaskList(list.name);
        for (let j = 0; j < list.tasks.length; j += 1) {
          const task = list.tasks[j];
          lists[i].add(
            new Task(task.name, task.date, task.notes, task.completed)
          );
        }
      }
      [selectedList] = lists;
      [selectedTask] = lists[0].tasks;
    } else {
      selectedList = new TaskList("Today");
      selectedTask = new Task("Example Task");
      selectedList.add(selectedTask);
      lists = [selectedList, new TaskList("Work"), new TaskList("Personal")];
    }
  }

  function renderList() {
    const $listTitle = document.getElementById("listTitle");
    $listTitle.textContent = selectedList.name;
    for (let i = 0; i < selectedList.tasks.length; i += 1) {
      const task = selectedList.tasks[i];
      let $task = document.getElementById(`task${i}`);
      if (!$task) {
        $task = create({
          type: "li",
          class: "list-task",
          parent: ".list",
          id: `task${i}`,
        });
        create({
          type: "button",
          class: "complete-button",
          parent: $task,
          id: `complete${i}`,
        });
        create({
          type: "span",
          parent: $task,
          text: task.name,
        });
      }
      if (task === selectedTask) {
        $task.classList.add("selected");
      } else if ($task.classList.contains("selected")) {
        $task.classList.remove("selected");
      }
      if (task.completed) {
        $task.classList.add("complete");
        $task.firstChild.classList.add("complete");
      } else {
        $task.classList.remove("complete");
        $task.firstChild.classList.remove("complete");
      }
    }
  }

  function renderDate(date) {
    selectedTask.setDate(date);
    const input = document.querySelector("#due");
    input.classList.add("set");
    let message = format(date, "MMMM d");
    if (isToday(date)) {
      message = "Today";
    }
    input.value = `Due ${message} at ${format(date, "h:mm a")}`;
    saveLists();
  }

  function clearDate() {
    const $input = document.querySelector("#due");
    $input.classList.remove("set");
    $input.value = "Add a due date...";
  }

  function renderNotes() {
    const $notes = document.getElementById("notes");
    $notes.value = selectedTask.notes;
  }

  function clearNotes() {
    const $notes = document.getElementById("notes");
    $notes.value = "";
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

  function saveNotes() {
    const $notes = document.getElementById("notes");
    selectedTask.setNotes($notes.value);
    displayController.toggleSaveButton();
    saveLists();
  }

  function updateSaveButton(message) {
    const $save = document.getElementById("saveNotes");
    $save.textContent = message;
    if (message === "Save Notes") {
      $save.classList.add("yellow");
    } else {
      $save.classList.remove("yellow");
    }
  }

  function toggleSaveButton() {
    const $save = document.getElementById("saveNotes");
    $save.classList.toggle("active");
  }

  function renderListInput() {
    const $input = create({
      type: "input",
      parent: "#lists",
      id: "newListInput",
    });
    $input.focus();
    return $input;
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

  function clearList() {
    deleteChildren(document.getElementById("list"));
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
    closeMenu("list");
    renderLists();
  }

  function openList() {
    const $list = document.getElementById("listCard");
    $list.classList.add("open");
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
    const task = selectedList.tasks[$button.id.substr(-1)];
    task.toggleCompleted();
    $button.classList.toggle("complete");
    saveLists();
    renderList();
  }

  function deleteTask() {
    deleteChildren(document.getElementById("list"));
    selectedList.remove(selectedTask);
    closeTask();
    saveLists();
  }

  function deleteList() {
    deleteChildren(document.getElementById("lists"));
    lists = lists.filter((list) => list !== selectedList);
    closeList();
    saveLists();
  }

  function renderEdit(type) {
    const $title = document.getElementById(`${type}Title`);
    const text = $title.textContent;
    $title.textContent = "";
    const $edit = create({
      type: "input",
      parent: `#${type}Title`,
      id: `${type}Edit`,
    });
    $edit.value = text;
    $edit.focus();
    return $edit;
  }

  // Sets the title of the passed element to given value
  // Uses cached lookup of $element
  function setTitle($element, value) {
    // eslint-disable-next-line no-param-reassign
    $element.textContent = value;
    if ($element.id === "listTitle") {
      selectedList.name = value;
      deleteChildren(document.getElementById("lists"));
      closeMenu("list");
      renderLists();
    } else if ($element.id === "taskTitle") {
      selectedTask.name = value;
      clearList();
      closeMenu("task");
      renderList();
    }
    saveLists();
  }

  function toggleSidebar() {
    const $sidebar = document.querySelector(".sidebar");
    const $sidebarButton = document.getElementById("toggleSidebar");
    $sidebar.classList.toggle("open");
    $sidebarButton.classList.toggle("open");
  }

  function initialize() {
    loadLists();
    renderLists();
    renderList();
    renderTask();
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
    renderEdit,
    setTitle,
    toggleSidebar,
  };
})();

export default displayController;
