module.exports = function (give, Mongo) {

  give 
    .field('username', Mongo.STRING)
    .field('amount', Mongo.NUMBER);

  give 
    .method('toJSON', function toJSON(){
      var d = {}
      d.username  = this.username;
      d.amount  = this.amount;
      return d;
    });
    
}
