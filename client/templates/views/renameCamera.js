Template.renameCamera.rendered = function() {
    TopMenuHelper.setStep(3);
};


Template.renameCamera.events({
    'submit #camera-name-form': function(e, t) {
        e.preventDefault();
        $('#camera-name').attr('disabled', 'disabled');
        var name = t.find('#camera-name').value;
        var userData = {
            name: name
        };
        Meteor.call('renameCamera', userData, function(error, result) {
            $('#camera-name').removeAttr('disabled');
            Router.go('success');
        });
    }
});