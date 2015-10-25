/*
* Model for transaction which represents a bank transaction entry.
*/
module.exports = function (give, Mongo) {

  give 
    .field('amount', Mongo.NUMBER)
    .field('user_id', Mongo.STRING)
    .field('currency', Mongo.STRING)
    .field('rate', Mongo.NUMBER)
    
  give 
    .method('toJSON', function toJSON(){
      var d = {}
      d.amount  = this.amount;
      d.user_id  = this.user_id;
      d.currency = this.currency;
      d.rate = this.rate;
      return d;
    });
}