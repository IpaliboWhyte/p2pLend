/*
* This route should handle the logic for the give endpoint, including 
* the give service to upload money to the central account.
*/

/* 
* Should typically be called for in a service as this will fluctuate 
* over time and will affect each give.
*/

const INTEREST_RATE = 2.5;

module.exports = function InitUser(Route) {

  Route
  .namespace('give').root('/');

/*
* This route is used to create and store a new give object. It is also 
* meant to have a machanism which uploads the amount unto the centralised bank account [bank -> mockdb]
*/
  Route
  .post('/give', 'should create a new give object and save')
  .body({
    amount: Route.type.NUMBER.invalid('INVALID_AMOUNT', 'amount should be an integer')
  })
  .then(function(userObj){
    var self = this,
    giveObj,
    amount = this.body('amount'),
    Give = self.schema('give');
    
    var user_id = 10;

    var data = {
      user_id: user_id,
      amount: amount,
      currency: 'USD',
      rate: INTEREST_RATE
    }

    giveObj = Give.build(data);
    // save to mongo
    giveObj.save().then(function(){
      console.log('saved give for user with id %s', user_id)
      self.success(giveObj);
    }).catch(function(err){
      self.error(err);
    });

  });

/*
* This is responsible for getting a give by id.
*/
  Route
  .get('/give/:id', 'Should return a give object corressponding to an id')
  .checkpoint('security:user')
  .param({
    id: Route.type.STRING.invalid('INVALID_ID', 'Please provide a valid id type')
  })
  .then(function(userObj){
    var self = this;
    _id = self.body.param('id'),
    Give = self.schema('give');

    // query mongo and return the corresponding giveObj by id
    Give.findOne({id: _id}, function(giveObj){
      if(giveObj) return self.success(giveObj);
      return self.error({message: 'Give Not Found'});
    });

  });
}