/**
 * Module dependencies.
 */
var xml = require('@xmpp/xml')
  , jid = require('@xmpp/jid')
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
exports.JID = jid;
exports.XMLElement = xml.Element;

/**
 * Expose constructors.
 */
exports.StanzaError = StanzaError;
