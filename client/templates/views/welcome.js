Template.welcome.helpers({
  ready: function(){
    // var mostRecentRecord = Networks.find( {}, {limit: 1, sort: {lastConnected: -1} } ).fetch();
    // console.log(mostRecentRecord[0]);
    // Session.set('currentNetwork', mostRecentRecord[0]);
    // TimeHelpers.initialConnect(mostRecentRecord[0]);

    // if (mostRecentRecord[0]) {
    //   Session.set('currentNetwork', mostRecentRecord[0]);
    //   TimeHelpers.initialConnect(mostRecentRecord[0]);
    // }

    return '';
  }
});

TimeHelpers = {
  scan: function() {
    setInterval(function(){
      TimeHelpers.callScan();
    }, 10000);
  },
  callScan: function() {
    Meteor.call('scan', function (error, result) {
      networks = result;
      Session.set('scanResults', networks);
    });
  },
  
  initialConnect: function(lastRecord) {
    
    Meteor.call('connect', lastRecord, function (error, result) {
      var currentNetwork = Session.get('currentNetwork');

      if (error) {
        currentNetwork.status = "Could not connect";
        Session.set({'currentNetwork': currentNetwork, 'templateRight': 'networkData' });
      }

      if (result) {
        currentNetwork.status = result;
        Session.set({'currentNetwork': currentNetwork, 'templateRight': 'networkData' });
      }
    });
  }
};

Template.welcome.rendered = function () {
  var mostRecentRecord = Networks.find( {}, {limit: 1, sort: {lastConnected: -1} } ).fetch();

  Session.set('currentNetwork', mostRecentRecord[0]);
  TimeHelpers.initialConnect(mostRecentRecord[0]);
};