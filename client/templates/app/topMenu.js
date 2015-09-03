Session.setDefault('user', localStorage.getItem("user"));
Template.menu.helpers({
    user: function() {
        return JSON.parse(Session.get('user'));
    },
    connected: function() {
        return JSON.parse(Session.get('connected'));
    }
});

TopMenuHelper = {
    setStep: function(step) {
        $('.topMenuStep').removeClass('active');
        $('#topMenuStep_' + step).addClass('active');
        if (!step) {
            $('.topMenu').hide();
        }
    }
};