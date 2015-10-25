/*
* This route should handle the logic for the give endpoint, including 
* the give service to upload money to the central account.
*/

/* 
* Should typically be called for in a service as this will fluctuate 
* over time and will affect each give.
*/

const INTEREST_RATE = 2.5;

module.exports = function InitUser(Route) {

  Route
  .namespace('give').root('/');

/*
* This route is used to create and store a new give object. It is also 
* meant to have a machanism which uploads the amount unto the centralised bank account [bank -> mockdb]
*/
  Route
  .post('/give', 'should create a new give object and save')
  .checkpoint('security:user')
  .body({
    amount: Route.type.NUMBER.invalid('INVALID_AMOUNT', 'amount should be an integer')
  })
  .then(function(userObj){

      amount = this.body('amount');

      // Transaction here
      var mongojs = require('mongojs');
      var db = mongojs('p2p', ['user', 'give']);
      var self = this;
      var moveMoneyBetweenCards = require('../utils').moveMoneyBetweenCards;
      moveMoneyBetweenCards("CENTRAL", "5184680430000279",
                            userObj.username, userObj.card).then(function(transactionId) {
          db.user.update({
              username: userObj.username
          }, { '$inc' : {
              total_amount: amount,
              total_amount_available: amount
          }}, function() {
              db.give.insert({
                  amount: amount,
                  username: userObj.username,
                  mastercardTransactionId: transactionId,
                  timestamp: new Date()
              }, function(err, item) {
                  if (err) {
                      return self.error(400, 'Transactions were not saved');
                  }
                  delete item._id;
                  return self.success(item);
              })
          });
      });
  });
    
    // Add money to both entries
    
}
