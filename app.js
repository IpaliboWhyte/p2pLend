/*
* Loading up the Crux module and starting configuration.
* */
var crux = require('node-crux');  // Turn this to require('node-crux');

var app = crux.app;

crux.globalize();

app
  .path(__dirname)
  .projectConfig('config/_project.yml')
  .appConfig('config/dev.js')
  .components(['log', 'mongo', 'service', 'server'], true);

app.init();

if(NODE_ENV === 'dev') {
  app.component('build').set('autoWatch', true);
}

app.run(function() {
  log.info('Example application running. Access it on %s', app.component('server').url);
});


/**
 * Some jsdoc stuff
 * @constructor
 * @param {string} title - The title della book
 * */
function Book(title, author) {

}