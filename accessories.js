//Helper function to set multiple attributes
function setAttributes(elem, attrs) {
  for(var key in attrs) {
    elem.setAttribute(key, attrs[key]);
  }
}