import Simplepicker from 'simplepicker';

const simplepicker = (function() {

  function initialize() {
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
    initialize
  }
  
})();

export default simplepicker;