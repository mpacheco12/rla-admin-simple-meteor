if (Meteor.isClient) {
    Session.setDefault('connected', false);
    Session.setDefault('scanning', true);
    Template.networkList.helpers({
        networks: function() {
          return Networks.find({});
        },
        isScanning: function(){
            if(Networks.find({}).count()<=0){
                Session.set('scanning',true)
            }else{
                Session.set('scanning',false)

            }
            return Session.get('scanning')
        },
        isConnected: function() {
            var networks = Networks.find({}).fetch();
            Session.set('connected', false);
            for (var i in networks) {
                if (networks[i]['connected'] == 'yes') {
                    Session.set('connected', true);
                    break;
                }
            }
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
    Template.connecting.helpers({
        connected:function() {
            var connection = Connections.findOne({});
            if(connection)
                if(connection.connected)
                    TopMenuHelper.setStep(2);
                else{
                    TopMenuHelper.setStep(2);
                    Session.set('connectStep',1);
                    TimeHelpers.scan();
                }
            return connection.connected
        }
    })
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
            TopMenuHelper.setStep(2);
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
                

            });
        }   
    })
}