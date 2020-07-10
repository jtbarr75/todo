import Simplepicker from "simplepicker";

const simplepicker = (function createSimplePicker() {
  let displayController;

  function createPicker() {
    const taskCard = document.querySelector("#taskCard");
    const picker = new Simplepicker(taskCard, {
      zIndex: 10,
      compactMode: true,
    });
    return picker;
  }

  function addOpenListener(picker) {
    const dueButton = document.getElementById("due");
    dueButton.addEventListener("click", () => {
      picker.reset(new Date());
      picker.open();
    });
  }

  function updateDateListener(picker) {
    picker.on("submit", (date) => {
      displayController.renderDate(date);
    });
  }

  function initialize(display) {
    displayController = display;
    const picker = createPicker();
    addOpenListener(picker);
    updateDateListener(picker);
  }

  return {
    initialize,
  };
})();

export default simplepicker;
