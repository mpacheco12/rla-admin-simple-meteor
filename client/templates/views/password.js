Template.password.helpers({
  currentNetwork: function () {
    var currentNetwork = Session.get('currentNetwork');
    return currentNetwork;
  }
});