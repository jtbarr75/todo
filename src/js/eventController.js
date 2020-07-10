import TaskList from './taskList';

const eventController = (function createEventController() {
  let editing;
  let displayController;

  function addTaskListener($target) {
    $target.addEventListener('click', (e) => {
      displayController.selectTask(e.target.closest('li').id);
    });
  }

  function addCompleteListener($target) {
    $target.addEventListener('click', (e) => {
      displayController.complete(e.target);
      e.stopPropagation();
    });
  }

  function listenForTaskActions() {
    const tasks = displayController.getTasks();
    for (let i = 0; i < tasks.length; i += 1) {
      const $taskButton = document.getElementById(`task${i}`);
      const $complete = document.getElementById(`complete${i}`);
      addTaskListener($taskButton);
      addCompleteListener($complete);
    }
  }

  function addTask() {
    const $newTaskInput = document.getElementById('newTaskInput');
    const { value } = $newTaskInput;
    if (value.length !== 0 && !!value.trim()) {
      displayController.addTask(value);
      listenForTaskActions();
    }
    $newTaskInput.value = '';
  }

  function listenForNewTask() {
    const $newTaskInput = document.getElementById('newTaskInput');
    const $newTaskButton = document.getElementById('newTaskButton');
    $newTaskInput.addEventListener('keyup', (e) => {
      if (e.keyCode === '13') {
        addTask();
      }
    });
    $newTaskButton.addEventListener('click', () => {
      addTask();
    });
  }

  function addListListener($target) {
    $target.addEventListener('click', (e) => {
      displayController.selectList(e.target.id);
      listenForNewTask();
      listenForTaskActions();
    });
  }

  function createListInput() {
    const $listInput = displayController.renderListInput();
    $listInput.addEventListener('keyup', (e) => {
      if (e.keyCode === '13') {
        displayController.addList(new TaskList(e.target.value));
        displayController.clearInput();
        addListListener(document.getElementById('lists').lastChild);
      }
    });
    $listInput.addEventListener('blur', () => {
      displayController.clearInput();
    });
  }

  function listenForNewList() {
    const $newListButton = document.getElementById('newListButton');
    $newListButton.addEventListener('click', () => {
      createListInput();
    });
  }

  function listenForSwitchLists() {
    const lists = displayController.getLists();
    for (let i = 0; i < lists.length; i += 1) {
      const $listButton = document.getElementById(`list${i}`);
      addListListener($listButton);
    }
  }

  function listenForEditNotes() {
    const $notes = document.getElementById('notes');
    $notes.addEventListener('click', () => {
      if (editing === false) {
        editing = true;
        displayController.toggleSaveButton();
      }
    });
  }

  function listenForAutoSave() {
    const $notes = document.getElementById('notes');
    $notes.addEventListener('blur', () => {
      editing = false;
      displayController.saveNotes();
    });
  }

  function listenForNotes() {
    listenForEditNotes();
    listenForAutoSave();
  }

  function actionOpen(type) {
    const $actionButton = document.getElementById(`${type}Actions`);
    $actionButton.addEventListener('click', () => {
      displayController.openMenu(type);
    });
  }

  function actionClose(type) {
    document.addEventListener('click', (e) => {
      if (e.target.parentElement.id !== `${type}Menu` && e.target.id !== `${type}Actions`) {
        displayController.closeMenu(type);
      }
    });
  }

  function listenForActions() {
    actionOpen('list');
    actionOpen('task');
    actionClose('list');
    actionClose('task');
  }

  function listenForCloseTask() {
    const $closeTask = document.getElementById('closeTask');
    $closeTask.addEventListener('click', () => {
      displayController.closeTask();
    });
  }

  function listenForCloseList() {
    const $closeList = document.getElementById('closeList');
    $closeList.addEventListener('click', () => {
      displayController.closeList();
    });
  }

  function listenForClose() {
    listenForCloseTask();
    listenForCloseList();
  }

  function listenForDeleteTask() {
    const $deleteTask = document.getElementById('deleteTask');
    $deleteTask.addEventListener('click', () => {
      displayController.deleteTask();
      listenForTaskActions();
    });
  }

  function listenForDeleteList() {
    const $deleteList = document.getElementById('deleteList');
    $deleteList.addEventListener('click', () => {
      displayController.deleteList();
      listenForSwitchLists();
    });
  }

  function listenForDelete() {
    listenForDeleteTask();
    listenForDeleteList();
  }

  function addEditListener($edit) {
    $edit.addEventListener('keyup', (e) => {
      if (e.keyCode === '13') {
        displayController.setTitle(e.target.parentElement, e.target.value);
        if (e.target.id === 'taskEdit') {
          listenForTaskActions();
        } else {
          listenForSwitchLists();
        }
      }
    });
  }

  function listenForEditTask() {
    const $editTask = document.getElementById('editTask');
    $editTask.addEventListener('click', () => {
      const $edit = displayController.renderEdit('task');
      addEditListener($edit);
    });
  }

  function listenForEditList() {
    const $editList = document.getElementById('editList');
    $editList.addEventListener('click', () => {
      const $edit = displayController.renderEdit('list');
      addEditListener($edit);
    });
  }

  function listenForEdit() {
    listenForEditTask();
    listenForEditList();
  }

  function initialize(display) {
    editing = false;
    displayController = display;

    listenForNewList();
    listenForSwitchLists();
    listenForNewTask();
    listenForTaskActions();
    listenForNotes();
    listenForActions();
    listenForClose();
    listenForDelete();
    listenForEdit();
  }

  return {
    initialize,
  };
}());

export default eventController;
