var vows = require('vows');
var assert = require('assert');
var xmpp = require('node-xmpp-core');
var util = require('util');
var StanzaError = require('junction/stanzaerror');
var serviceDiscovery = require('junction/middleware/serviceDiscovery');


vows.describe('serviceDiscovery').addBatch({

  'with identities and features': {
    topic: function() {
      return serviceDiscovery([ { category: 'conference', type: 'text', name: 'Play-Specific Chatrooms' },
                                { category: 'directory', type: 'chatroom' } ],
                              [ 'http://jabber.org/protocol/disco#info', 
                                'http://jabber.org/protocol/muc' ]);
    },
    
    'when handling a service discovery request': {
      topic: function(serviceDiscovery) {
        var self = this;
        var req = new xmpp.Stanza('iq', { type: 'get', to: 'plays.shakespeare.lit', from: 'romeo@montague.net/orchard', id: 'info1' });
        req.c('query', { xmlns: 'http://jabber.org/protocol/disco#info' }).up();
        var res = new xmpp.Stanza('iq', { id: req.attrs.id,
                                           to: req.attrs.from,
                                           type: 'result' });
        
        res.send = function() {
          self.callback(null, res);
        }
        function next(err) {
          self.callback(new Error('should not call next'));
        }
        process.nextTick(function () {
          serviceDiscovery(req, res, next)
        });
      },
      
      'should not call next' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call send' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
      'should send correct result' : function(err, stanza) {
        assert.equal(stanza.toString(), '<iq id="info1" to="romeo@montague.net/orchard" type="result"><query xmlns="http://jabber.org/protocol/disco#info"><identity category="conference" type="text" name="Play-Specific Chatrooms"/><identity category="directory" type="chatroom"/><feature var="http://jabber.org/protocol/disco#info"/><feature var="http://jabber.org/protocol/muc"/></query></iq>');
      },
    },
    
    'when handling a service discovery request to a node': {
      topic: function(serviceDiscovery) {
        var self = this;
        var req = new xmpp.Stanza('iq', { type: 'get', to: 'plays.shakespeare.lit', from: 'romeo@montague.net/orchard', id: 'info1' });
        req.c('query', { xmlns: 'http://jabber.org/protocol/disco#info', node: 'books' }).up();
        var res = new xmpp.Stanza('iq', { id: req.attrs.id,
                                           to: req.attrs.from,
                                           type: 'result' });
        
        res.send = function() {
          self.callback(new Error('should not call send'));
        }
        function next(err) {
          self.callback(err, req);
        }
        process.nextTick(function () {
          serviceDiscovery(req, res, next)
        });
      },
      
      'should indicate an error' : function(err, stanza) {
        assert.instanceOf(err, StanzaError);
        assert.equal(err.type, 'cancel');
        assert.equal(err.condition, 'item-not-found');
      },
    },
    
    'when handling a non-IQ-get service discovery request': {
      topic: function(serviceDiscovery) {
        var self = this;
        var req = new xmpp.Stanza('iq', { type: 'set', to: 'plays.shakespeare.lit', from: 'romeo@montague.net/orchard', id: 'info1' });
        req.c('query', { xmlns: 'http://jabber.org/protocol/disco#info' }).up();
        var res = new xmpp.Stanza('iq', { id: req.attrs.id,
                                           to: req.attrs.from,
                                           type: 'result' });
        
        res.send = function() {
          self.callback(new Error('should not call send'));
        }
        function next(err) {
          self.callback(err, req);
        }
        process.nextTick(function () {
          serviceDiscovery(req, res, next)
        });
      },
      
      'should indicate an error' : function(err, stanza) {
        assert.instanceOf(err, StanzaError);
        assert.equal(err.type, 'modify');
        assert.equal(err.condition, 'bad-request');
      },
    },
    
    'when handling an IQ stanza that is not a service discovery request': {
      topic: function(softwareVersion) {
        var self = this;
        var iq = new xmpp.Stanza('iq', { type: 'get', to: 'romeo@example.net', from: 'juliet@example.com' });
        var res = new xmpp.Stanza('iq', { id: iq.attrs.id,
                                           to: iq.attrs.from,
                                           type: 'result' });
        
        res.send = function() {
          self.callback(new Error('should not call send'));
        }
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          softwareVersion(iq, res, next)
        });
      },
      
      'should not call send' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call next' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
    },
  },
  
  'with identity and feature': {
    topic: function() {
      return serviceDiscovery({ category: 'client', type: 'pc' },
                              'http://jabber.org/protocol/disco#info');
    },
    
    'when handling a service discovery request': {
      topic: function(serviceDiscovery) {
        var self = this;
        var req = new xmpp.Stanza('iq', { type: 'get', to: 'plays.shakespeare.lit', from: 'romeo@montague.net/orchard', id: 'info1' });
        req.c('query', { xmlns: 'http://jabber.org/protocol/disco#info' }).up();
        var res = new xmpp.Stanza('iq', { id: req.attrs.id,
                                           to: req.attrs.from,
                                           type: 'result' });
        
        res.send = function() {
          self.callback(null, res);
        }
        function next(err) {
          self.callback(new Error('should not call next'));
        }
        process.nextTick(function () {
          serviceDiscovery(req, res, next)
        });
      },
      
      'should not call next' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call send' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
      'should send correct result' : function(err, stanza) {
        assert.equal(stanza.toString(), '<iq id="info1" to="romeo@montague.net/orchard" type="result"><query xmlns="http://jabber.org/protocol/disco#info"><identity category="client" type="pc"/><feature var="http://jabber.org/protocol/disco#info"/></query></iq>');
      },
    },
  },

}).export(module);
