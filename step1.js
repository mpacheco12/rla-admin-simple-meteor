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
        connectStep4: function() {
            if (Session.get('connectStep') == 4)
                return true;
            return false;
        },
    });
    Template.password.helpers({
        currentNetwork:function(){
            return Session.get('currentNetworkSSID');
        }
    });
    Template.networkData.helpers({
        networkStatus:function(){
            return Session.get('networkStatus');
        },
        networkBssid:function(){
            return Session.get('networkBssid');
        },
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
            Session.set('networkBssid',this.bssid);
            Session.set('connectStep', 2);
        },
    });
    Template.networkData.events({
        'click .btn': function(){
            Session.set('connectStep', 1);
            TopMenuHelper.setStep(2);
        },
        'click .back-btn':function(){
            Session.set('connectStep', 1);
            TopMenuHelper.setStep(1);
        }
    })
    Template.password.events({
        'click .btn': function(){
            Session.set('connectStep', 3);

            var currentNetwork = Session.get('currentNetworkSSID');

            var connectionData = {
                ssid: currentNetwork,
                password: $('.password_input').val()
            };

            console.log("attempting to connect with: ", connectionData);

            Meteor.call('connect', connectionData, function(error, result) {
                
                if (error) {
                    currentNetwork = false;
                    Session.set({
                        'currentNetworkSSID': currentNetwork,
                        'connectStep': 4,
                        'connected': false,
                        'networkStatus':'not connected'
                    });
                    return
                }

                if (result) {
                    Session.set({
                        'currentNetworkSSID': currentNetwork,
                        'connectStep': 4,
                        'connected': true,
                        'networkStatus':'connected'
                    });
                    return
                }

            });
        }   
    })
}