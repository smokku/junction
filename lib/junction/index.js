/**
 * Module dependencies.
 */
var xmpp = require('node-xmpp-core')
  , application = require('./application')
  , utils = require('./utils')
  , StanzaError = require('./stanzaerror');


// expose create() as the module
exports = module.exports = create;

/**
 * Create a Junction application.
 *
 * @return {Function}
 * @api public
 */
function create() {
  function app(stanza) { app.handle(stanza); }
  utils.merge(app, application);
  app._stack = [];
  app._filters = [];
  for (var i = 0; i < arguments.length; ++i) {
    app.use(arguments[i]);
  }
  return app;
}

/**
 * Expose `.create()` as module method.
 */
exports.create = create;


/**
 * Expose constructors.
 */
exports.JID = xmpp.JID;
exports.XMLElement = xmpp.Element;
exports.XMPPStanza = xmpp.Stanza;

/**
 * Expose constructors.
 */
exports.StanzaError = StanzaError;

exports.message = require('./middleware/message');
exports.messageParser = require('./middleware/messageParser')
exports.presence = require('./middleware/presence');
exports.presenceParser = require('./middleware/presenceParser')
