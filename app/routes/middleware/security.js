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
    User.find(
      {
        token: this.header('x-access-token')
      },function(userObj){
        self.pass(userObj);
    })
  });
}