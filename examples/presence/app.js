var junction = require('junction');
var argv = require('optimist').argv;

console.log('Junction: Presence Example');
console.log('  (using Junction + ' + junction.version + ')');

var options = {
  type: 'client',
  jid: argv.i,
  password: argv.P
};

var connection = junction.create();

connection.use(junction.presence(function(handler) {
  handler.on('available', function(stanza) {
    console.log(stanza.attrs.from + ' is available');
  });
  handler.on('unavailable', function(stanza) {
    console.log(stanza.attrs.from + ' is unavailable');
  });
}));

connection.use(junction.serviceUnavailable());
connection.use(junction.errorHandler());
connection.filter(junction.filters.dump());

connection.connect(options).on('online', function() {
  console.log('Connected as: ' + this.jid);
  this.send(new junction.elements.Presence());
});
