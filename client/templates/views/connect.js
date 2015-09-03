Template.connect.events({
    'click .network-item': function() {
        var currentNetwork = this;
        _.extend(currentNetwork, {
            status: "Not connected"
        });

        console.log(currentNetwork);

        Session.set({
            'currentNetwork': currentNetwork,
            'templateRight': 'password',
            'templateLeft': 'networkList'
        });
    },
    'submit form': function(event) {
        event.preventDefault();
        Session.set('templateRight', 'connecting');

        var currentNetwork = Session.get('currentNetwork');

        var connectionData = {
            ssid: currentNetwork.ssid,
            password: event.target.password.value
        };

        console.log("attempting to connect with: ", connectionData);

        Meteor.call('connect', connectionData, function(error, result) {
            if (error) {
                currentNetwork.status = "Could not connect";
                Session.set({
                    'currentNetwork': currentNetwork,
                    'templateRight': 'networkData',
                    'connected': false
                });
            }

            if (result) {
                currentNetwork.status = result;
                Session.set({
                    'currentNetwork': currentNetwork,
                    'templateRight': 'networkData',
                    'connected': true
                });

                var network = {
                    ssid: currentNetwork.ssid,
                    bssid: currentNetwork.bssid,
                    password: event.target.password.value,
                    lastConnected: Date.now()
                };

                Meteor.call('upsertNetwork', network, function(error, result) {});
            }

        });
    }
});

Template.connect.helpers({
    currentNetwork: function() {
        var currentNetwork = Session.get('currentNetwork');
        return currentNetwork;
    },
    templateRight: function() {
        return Session.get('templateRight');
    },
    templateLeft: function() {
        return Session.get('templateLeft');
    }
});

Template.connect.rendered = function() {
    Session.set('templateRight', 'networkList');
    Session.set('templateLeft', 'instruction');
    TopMenuHelper.setStep(1);
};