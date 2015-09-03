if (Meteor.isClient) {
    // counter starts at 0

    Session.setDefault('step', 1);
    Session.setDefault('connectStep', 1);
    
    
    TopMenuHelper = {
        setStep: function(step) {
            $('.topMenuStep').removeClass('active');
            $('#topMenuStep_' + step).addClass('active');
            if (!step) {
                $('.topMenu').hide();
            }
            Session.set('step', step);
        }
    };
    Template.step.helpers({
        isStep1: function() {
            if (Session.get('step') == 1)
                return true;
            return false;
        },
        isStep2: function() {
            if (Session.get('step') == 2)
                return true;
            return false;
        },
        isStep3: function() {
            if (Session.get('step') == 3)
                return true;
            return false;
        },
        isStep4: function() {
            if (Session.get('step') == 4)
                return true;
            return false;
        }
    });
    TimeHelpers = {

        scan: function() {
            Meteor.call('scan', function(error, result) {
            });
        },

        initialConnect: function(lastRecord) {

            Meteor.call('connect', lastRecord, function(error, result) {
                var currentNetwork = Session.get('currentNetwork');
                console.log(error);
                console.log(result);
                if (error) {
                    currentNetwork.status = "Could not connect";
                    Session.set({
                        'currentNetwork': currentNetwork,
                        'templateRight': 'networkData'
                    });

                }
                if (result) {
                    currentNetwork.status = result;
                    Session.set({
                        'currentNetwork': currentNetwork,
                        'connectStep': 3,
                    });
                }
            });
        }
    };
    TimeHelpers.scan();
    // Session.set('scanResults', [{ssid:'asd'}]);
    TopMenuHelper.setStep(1);
}