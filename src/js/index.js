import displayController from "./displayController";
import Element from "./element";
import Simplepicker from 'simplepicker';
import { format, isToday } from 'date-fns';

// displayController.create(new Element("div", "#main", "test", "hello"));

const taskCard = document.querySelector("#taskCard");
const picker = new Simplepicker(taskCard, {
  zIndex: 10,
  compactMode: true
});
const dueButton = document.getElementById("due");
dueButton.addEventListener("click", (e) => {
  picker.reset(new Date);
  picker.open();
})
picker.on("submit", function (date, readableDate) {
  var input = document.querySelector("#due");
  input.classList.add("set");
  if (isToday(date)) {
    var message = "Today";
  }
  input.value = `Due ${format(date, 'MMMM d')} at ${format(date, 'h:mm a')}`;
})