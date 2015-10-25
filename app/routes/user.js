/*
* This should contain all the logic for the user sub endpoints
*/
module.exports = function InitUser(Route) {
  Route
  .namespace('user').root('/')


  Route
  .checkpoint('security:user')
  .get('/user', 'should return the current user')
  .then(function(userObj){
    var self = this;
    self.success(userObj);
  });

  /*
  * Get current user
  */
  Route
  .post('/user', 'should return the current user')
  .checkpoint('security:user')
  .then(function(userObj){
    var self = this;
    self.success(userObj);
  });

}