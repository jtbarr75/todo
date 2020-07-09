import simplepicker from "./simplePickerConfig";
import displayController from "./displayController";
import eventController from "./eventController";

simplepicker.initialize();
displayController.initialize();
eventController.initialize(displayController);

