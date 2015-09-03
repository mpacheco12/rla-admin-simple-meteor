Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTempalte: 'notFound',
});

// Router.route('/', {
//     name: 'welcome',
//     waitOn: function() {
//         return Meteor.subscribe('networks');
//     }
// });
Router.route('/', function() {
    this.render('connect');
});

Router.route('/connect', {
    name: 'connect'
});
Router.route('/dashboard', {
    name: 'dashboard'
});
Router.route('/renameCamera', {
    name: 'renameCamera'
});
Router.route('/login', {
    name: 'login'
});
Router.route('/success', {
    name: 'success'
});