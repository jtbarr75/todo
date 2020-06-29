const displayController = (function() {
  function create(e) {
    const element = document.createElement(e.type);
    if (typeof(e.text) == "string") {
      element.textContent = e.text;
    }
    if (typeof(e.src) == "string") {
      element.src = e.src
    }
    if (Array.isArray(e.classes)) {
      element.classList.add(...e.classes);
    } else if (typeof(e.classes) == "string") {
      element.classList.add(e.classes);
    }
    document.querySelector(e.parent).appendChild(element);
    return element;
  }

  return {
    create,
  }
})();

export default displayController;