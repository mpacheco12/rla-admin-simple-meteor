Template.login.rendered = function() {
    TopMenuHelper.setStep(2);
};

Template.login.helpers({
    error: function() {
        return Session.get('error');
    }
});
Template.login.events({
    'submit #login-form': function(e, t) {
        e.preventDefault();
        Session.set('error', false);
        $('#login-email').attr('disabled', 'disabled');
        $('#login-password').attr('disabled', 'disabled');
        // retrieve the input field values
        var email = t.find('#login-email').value,
            password = t.find('#login-password').value;
        $.ajax({
            url: 'http://localhost:3000/verifyUser',
            type: 'post',
            data: {
                email: email,
                password: password
            },
            success: function(data) {
                $('#login-email').removeAttr('disabled');
                $('#login-password').removeAttr('disabled');
                if (data == 'error') {
                    Session.set('error', 'Invalid user or password');

                } else {
                    Session.set('error', false);
                    var userData = {
                        id: data['_id']
                    };
                    Meteor.call('saveLoginInfo', userData, function(error, result) {
                        console.log(result);
                        if (result == 'error') {
                            Session.set('error', 'An unexpected error has occurred. Please try again.');
                            return;
                        }
                        Router.go('renameCamera');
                    });

                }
            }
        });
        return false;
    },
});