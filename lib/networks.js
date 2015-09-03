Networks = new Mongo.Collection('networks');

var Schemas = {};

Schemas.Networks = new SimpleSchema({
  ssid: {
    type: String,
    label: "Network name",
  },
  bssid: {
    type: String,
    label: "Network ID",
    regEx: /..:..:..:..:..:../
  },
  password: {
    type: String,
    label: "Network password",
    optional: true
  },
  lastConnected: {
    type: Number,
    label: "Date of last successful connection",
  }
});

Networks.attachSchema(Schemas.Networks);

Meteor.methods({
  upsertNetwork: function (network) {
    Networks.upsert({ ssid: network.ssid, bssid: network.bssid }, { $set: network }, function() {
      console.log("successfully saved network");
    });
  }
});

