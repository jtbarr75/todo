import simplepicker from './simplePickerConfig';
import displayController from './displayController';
import eventController from './eventController';

displayController.initialize();
simplepicker.initialize(displayController);
eventController.initialize(displayController);
