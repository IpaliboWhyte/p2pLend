module.exports = function InitUser(Route) {

  Route
  .namespace('take').root('/');

/*
* This route is used to create and store a new give object. It is also 
* meant to have a machanism which uploads the amount unto the centralised bank account [bank -> mockdb]
*/
  Route
  .post('/take', 'should create a new take object and save')
  .checkpoint('security:user')
  .body({
    amount: Route.type.NUMBER.invalid('INVALID_AMOUNT', 'amount should be an integer')
  })
  .then(function(userObj){
    var self = this,
    amount = this.body('amount'),
    User = this.schema('user');

    var mongojs = require('mongojs');
    var moveMoneyBetweenCards = require('../utils').moveMoneyBetweenCards;
    var db = mongojs('p2p', ['user', 'transaction']);
    console.log("OUTSIDE");
    console.log(amount);
    db.user
        .find({total_amount_available: {$gt: 0}, username: { $ne: userObj.username }})
        .sort({total_amount_available: -1}, function(err, docs) {
      
      // Check if total amount is possible
      var totalInBank = 0;
      docs.forEach(function(doc) {
        totalInBank += doc.total_amount_available;
      });
      if (totalInBank < amount) {
        return self.error(400, 'you dont have enough funds');
      }

      // GET 10 cents from each until request is satisfied
      var loans = {}
      var current_idx = 0;
      var amount_needed = amount;
      console.log(amount_needed);
      while (amount_needed > 0) {
          // Get the item
          console.log(amount_needed);
          var item = docs[current_idx % docs.length];
          if (item.total_amount_available > 0) {
            // Fund 10 cents
            item.total_amount_available -= 10;
            amount_needed -= 10;

            // Record transaction
            if (loans[item.username] === undefined) {
              loans[item.username] = 0;
            }
            loans[item.username] += 10;
          }
          // Increment ID
          current_idx += 1;
      }

      moveMoneyBetweenCards("CENTRAL", "5184680430000279",
                            userObj.username, userObj.card).then(function(transactionId) {

          // For each profile save the transaction
          var total = Object.keys(loans).length;
          var totalCompleted = 0;
          var transactions = [];
          if (total == 0) {
              return self.error(400, 'Transactions were not saved');
          }
          console.log(loans);
          for (var username in loans) {
              console.log(transactions);
              var am = loans[username];
              db.user.update({
                  username: username
              }, { '$inc' : {
                  total_amount_available: -am
              }}, function(am, username) {
                  return function() {
                      db.transaction.insert({
                          amount: am,
                          mastercardTransactionId: transactionId,
                          from_user: username,
                          to_user: userObj.username,
                          timestamp: new Date()
                      }, function(err, item) {
                          delete item.mastercardTransactionId;
                          if (err) {
                              return self.error(400, 'Transactions were not saved');
                          }
                          totalCompleted += 1;
                          console.log(totalCompleted);
                          transactions.push(item);
                          if (totalCompleted == total) {
                            return self.success({
                                mastercardTransactionId: transactionId,
                                transactions: transactions
                            });
                          }
                      })
                  }
              }(am, username));
          }
      });
    });
  });
}
