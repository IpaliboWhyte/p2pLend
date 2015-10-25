module.exports = function (give, Mongo) {

  give 
    .field('user_id', Mongo.STRING)
    .field('amount', Mongo.NUMBER);

  give 
    .method('toJSON', function toJSON(){
      var d = {}
      d.user_id  = this.user_id;
      d.amount  = this.amount;
      return d;
    });
    
}
