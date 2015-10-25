/*
* This should contain all the logic for the user sub endpoints
*/
module.exports = function InitUser(Route) {
  Route
  .namespace('user').root('/')


  Route
  .checkpoint('security:user')
  .get('/user', 'should return the current user')
  .then(function(userObj) {
      var mongojs = require('mongojs');
      var db = mongojs('p2p', ['transactions', 'give']);
      var self = this;

      // Credit history
      db.give
        .find({username: userObj.username, mastercardTransactionId: {$exists: true}})
        .sort({timestamp: -1}, function(err, items) {
          items.forEach(function(item) {
              delete item.username;
          });
          userObj['credit_history']= items;
          self.success(userObj);
      });

  });

}
