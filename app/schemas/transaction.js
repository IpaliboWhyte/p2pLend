/*
* Model for transaction which represents a bank transaction entry.
*/
module.exports = function (give, Mongo) {

  give 
    .field('amount', Mongo.NUMBER)
    .field('from_user', Mongo.NUMBER)
    .field('to_user', Mongo.NUMBER);
    
  give 
    .method('toJSON', function toJSON(){
      var d = {}
      d.amount  = this.amount;
      d.from_user  = this.from_user;
      d.to_user = this.to_user;
      return d;
    });
}
