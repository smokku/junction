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

/**
 * Expose bundled filters.
 */
exports.filters = {
  dump: require('./filters/dump'),
  pending: require('./filters/pending'),
};

/**
 * Expose bundled middleware.
 */
exports.middleware = {
  capabilitiesParser: require('./middleware/capabilitiesParser'),
  dump: require('./middleware/dump'),
  errorHandler: require('./middleware/errorHandler'),
  logger: require('./middleware/logger'),
  message: require('./middleware/message'),
  messageParser: require('./middleware/messageParser'),
  pending: require('./middleware/pending'),
  presence: require('./middleware/presence'),
  presenceParser: require('./middleware/presenceParser'),
  serviceDiscovery: require('./middleware/serviceDiscovery'),
  serviceUnavailable: require('./middleware/serviceUnavailable'),
};
for (name in exports.middleware) {
  exports[name] = exports.middleware[name]
};
