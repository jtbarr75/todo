class Element {
  constructor(type, parent, classes, text, src) {
    this.type = type;
    this.parent = parent || "#main";
    this.text = text;
    this.src = src;
    if (Array.isArray(classes)) {
      this.classes = classes;
    } else if (typeof(classes) == "string") {
      this.classes = [classes];
    }
  }
}

export default Element;