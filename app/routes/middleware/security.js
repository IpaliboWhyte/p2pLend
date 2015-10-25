module.exports = function InitUser(Route) {

  Route
  .namespace('security')
  .root('/');

  Route
  .middleware('user', 'mock security checkpoint for user chat')
  .header({
    'x-access-token': Route.type.STRING.invalid("INVALID_TOKEN", "Please enter a valid token type")
  })
  .then(function(){

    var self = this,
    User = this.schema('user');

    var mongojs = require('mongojs');
    var db = mongojs('p2p', ['user']);

    db.user.find(
      {
        token: self.header('x-access-token')
      },function(err, userObj){
          if (err) {
              return self.fail({reason: "User not found"})
          }
          self.pass(userObj[0]);
    })
  });
}
