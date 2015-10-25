module.exports = function InitUser(Route) {

  Route
  .namespace('take').root('/');

/*
* This route is used to create and store a new give object. It is also 
* meant to have a machanism which uploads the amount unto the centralised bank account [bank -> mockdb]
*/
  Route
  .post('/take', 'should create a new take object and save')
  .body({
    amount: Route.type.NUMBER.invalid('INVALID_AMOUNT', 'amount should be an integer')
  })
  .then(function(userObj){
    var self = this,
    amount = this.body('amount'),
    User = this.schema('user');

    var mongojs = require('mongojs');
    var db = mongojs('p2p', ['user']);
    db.user.find({total_amount_available: {$gt: 0}}).sort({total_amount_available: -1}, function(err, docs) {
      
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
      while (amount_needed > 0) {
          // Get the item
          var item = docs[current_idx % docs.length];
          if (item.total_amount_available > 0) {
            // Fund 10 cents
            item.total_amount_available -= 10;
            amount_needed -= 10;

            // Record transaction
            if (loans[item._id] === undefined) {
              loans[item._id] = 0;
            }
            loans[item._id] += 10;
          }
          // Increment ID
          current_idx += 1;
      }
      console.log(loans);
      return self.success();
    });

  });

}