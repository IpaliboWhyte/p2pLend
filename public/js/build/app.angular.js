(function(window, angular, $) {
(function() {

var _states = {};

/* We place our defineState() function on angular. */
angular.defineState = function DefineState(stateName, stateOptions) {
  if(typeof stateName !== 'string') throw new Error('Invalid state name: ' + stateName);
  if(typeof _states[stateName] !== 'undefined') throw new Error('State already exists: ' + stateName);
  _states[stateName] = stateOptions;
  return angular;
};
angular.getStates = function GetDefinedStates() {
  return _states;
};

var _controllerModule = null,
  _controllerDependencies = [];
/* We pretty much define a custom controller registration */
angular.defineController = function DefineController(name) {
  if(_controllerModule === null) {
    _controllerModule = angular.module('app.controllers', _controllerDependencies);
  }
  return _controllerModule.controller.apply(_controllerModule, arguments);
};
})();
(function() {

angular.defineState('about', {
  url: '/about',
  templateUrl: 'about',
  controller: 'AboutCtrl'
});


angular.defineController('AboutCtrl', function($scope) {
   $scope.version = "0.1";

});
})();
(function() {

angular.defineState('contact', {
  url: '/contact',
  templateUrl: 'contact',
  controller: 'ContactCtrl'
});

angular.defineController('ContactCtrl', function($scope, $http) {
  $scope.time = new Date();
  $scope.form = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  $scope.sendContact = function Send() {
    console.log($scope.form);
    if(!$scope.form.name || !$scope.form.email || !$scope.form.message) {
      return alert('Please fill in the form');
    }
    $http.post('/contact', $scope.form)
      .success(function(d) {
        if(d.type === 'error') {
          alert('Error: ' + d.code + ': ' + d.message);
        }
        alert('Sent: ' + d.message);
      })
      .error(function(err, status) {
        alert('Error occurred.');
        console.log("ERR", err);
      });
  }
});

})();
(function() {

angular.defineState('landing', {
  url: '/',
  templateUrl: 'home',
  controller: 'HomeCtrl'
});

angular.defineController('HomeCtrl', function($scope) {
  $scope.time = new Date();
});

})();
(function() {
/*
* Demo angular app
* */
var dependencies = ['ui.router', 'app.controllers'];
var app = angular.module('app', dependencies);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  var _states = angular.getStates();
  for(var stateName in _states) {
    $stateProvider.state(stateName, _states[stateName]);
  }
});


app.run(function($rootScope) {

});
})();
(function() {
/**
 * Class File: config.dev.js
 * Created by adrianbunta on 1/12/2015.
 */

})();
})(window, window['angular'] || {}, window['jQuery'] || window['$'] || {}, undefined);