module.exports = function (user, Mongo) {

  user 
    .field('username', Mongo.STRING)
    .field('avatar_url', Mongo.STRING)
    .field('password', Mongo.STRING, {
      defaultValue: '1'
    })
    .field('total_amount', Mongo.NUMBER)
    .field('total_amount_available', Mongo.NUMBER)
    .field('token', Mongo.STRING);

  user 
    .method('toJSON', function toJSON(){
      var d = {}
      d.username  = this.username;
      d.avatar_url  = this.avatar_url;
      d.total_amount  = this.total_amount;
      d.total_amount_available = this.total_amount_available;
      return d;
    }); 
}