module.exports = function (give, Mongo) {

  give 
    .field('user_id', Mongo.STRING)
    .field('amount', Mongo.NUMBER)
    .field('rate', Mongo.NUMBER)
    .field('currency', Mongo.STRING);

  give 
    .method('toJSON', function toJSON(){
      var d = {}
      d.user_id  = this.user_id;
      d.amount  = this.amount;
      d.rate  = this.rate;
      d.currency = this.currency;
      return d;
    });
    
}