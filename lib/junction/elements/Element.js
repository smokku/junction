var XMLElement = require('node-xmpp').Element;

function Element(name, xmlns) {
  this.parent = null;
  this.name = name;
  this.xmlns = xmlns;
  this.children = [];
}

Element.prototype.c = function(child) {
  this.children.push(child);
  child.parent = this;
  return child;
}

Element.prototype.up = function() {
  if (this.parent) {
    return this.parent;
  } else {
    return this;
  }
};

Element.prototype.toXML = function() {
  var attrs = this.xmlAttributes();
  attrs['xmlns'] = this.xmlns;
  var xml = new XMLElement(this.name, attrs);
  this.children.forEach(function(child) {
    xml.children.push(child.toXML());
  });
  return xml;
}

Element.prototype.xmlAttributes = function() {
  return {};
}


exports = module.exports = Element;