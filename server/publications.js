Meteor.publish('networks', function() {
  return Networks.find();
});
