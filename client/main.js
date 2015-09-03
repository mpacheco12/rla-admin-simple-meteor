Meteor.startup(function () {
  TimeHelpers.callScan();
  TimeHelpers.scan();
  console.log("Startup, scanning for networks");
});