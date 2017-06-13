var vows = require('vows');
var assert = require('assert');
var junction = require('junction');
var util = require('util');


vows.describe('junction').addBatch({
  
  'should export create function': function() {
    assert.isFunction(junction);
    assert.isFunction(junction.create);
    assert.equal(junction, junction.create);
  },
  
  'should export constructors': function() {
    assert.isFunction(junction.JID);
    assert.isFunction(junction.XMLElement);
    assert.isFunction(junction.XMPPStanza);
  },
  
  'should export errors': function() {
    assert.isFunction(junction.StanzaError);
  },
  
}).export(module);
