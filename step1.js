if (Meteor.isClient) {
    Session.setDefault('scanResults', false);
    Session.setDefault('connected', false);
    Template.networkList.helpers({
        networks: function() {
            var networks = Session.get('scanResults');
            return networks;
        },
        isConnected: function() {
            return Session.get('connected');
        }

    });
    Template.step1.helpers({
        connectStep1: function() {
            console.log(Session.get('connectStep'))
            if (Session.get('connectStep') == 1)
                return true;
            return false;
        },
        connectStep2: function() {
            if (Session.get('connectStep') == 2)
                return true;
            return false;
        },
        connectStep3: function() {
            if (Session.get('connectStep') == 3)
                return true;
            return false;
        },
        currentNetwork:function(){
            return Session.get('currentNetworkSSID');
        }
    });
    Template.password.helpers({
        currentNetwork:function(){
            return Session.get('currentNetworkSSID');
        }
    })
    Template.connected.events({
        'click .continue-btn':function(){
            Session.set({
                'step': 2
            });
        }
    });
    Template.networkListItem.events({
        'click .network-item': function() {
            Session.set('currentNetworkSSID',this.ssid);
            Session.set('connectStep', 2);
        },
    });
    Template.step1.events({
        
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
}